import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { contact, privacyNotice } from '../data/site.ts'
import type { ProjectId } from '../data/site.ts'
import { Contact } from './Contact.tsx'

const CONSENT_ERROR = 'Acepta el aviso de privacidad para agendar tu cita.'
const NOTICE = 'Solicitud enviada. Esta página es una demostración: no guardamos tus datos.'

// Same as App: the chosen condominium lives outside the form.
function Harness({ initial = '' }: { initial?: ProjectId | '' }) {
  const [interest, setInterest] = useState(initial)
  return <Contact interest={interest} onInterestChange={setInterest} />
}

// Most tests start with the privacy notice already accepted.
function setup(initial: ProjectId | '' = '', { consent = true } = {}) {
  const view = render(<Harness initial={initial} />)
  const consentBox = screen.getByRole('checkbox', { name: /Leí y acepto el aviso de privacidad/ })
  if (consent) fireEvent.click(consentBox)
  return {
    ...view,
    name: screen.getByLabelText(/^Nombre/) as HTMLInputElement,
    phone: screen.getByLabelText(/^Teléfono a 10 dígitos/) as HTMLInputElement,
    project: screen.getByLabelText('Condominio que te interesa') as HTMLSelectElement,
    comment: screen.getByLabelText(/^Comentario/) as HTMLTextAreaElement,
    consent: consentBox as HTMLInputElement,
    dialog: view.container.querySelector('dialog.confirm:not(.privacy)') as HTMLDialogElement,
    privacy: view.container.querySelector('dialog.privacy') as HTMLDialogElement,
    submit: () => fireEvent.click(screen.getByRole('button', { name: 'Agendar Cita' })),
  }
}

const type = (field: HTMLElement, value: string) => fireEvent.change(field, { target: { value } })

function fillValid(fields: ReturnType<typeof setup>) {
  type(fields.name, 'Ana López')
  type(fields.phone, '55 1234 5678')
  if (!fields.consent.checked) fireEvent.click(fields.consent)
}

describe('Contact: sales centre details', () => {
  it('shows address, hours, phone, email and WhatsApp', () => {
    const { container } = setup()
    expect(container.querySelector('.contact__list')).toHaveTextContent(contact.address[0])
    for (const slot of contact.hours) {
      expect(screen.getByText(slot.days)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: contact.phone })).toHaveAttribute(
      'href',
      contact.phoneHref,
    )
    expect(screen.getByRole('link', { name: contact.email })).toHaveAttribute(
      'href',
      `mailto:${contact.email}`,
    )
    const whatsapp = screen.getByRole('link', { name: contact.whatsapp })
    expect(whatsapp).toHaveAttribute('href', contact.whatsappHref)
    expect(whatsapp).toHaveAttribute('target', '_blank')
  })
})

describe('Contact: validation', () => {
  it('marks only the required fields with an asterisk', () => {
    const fields = setup()
    expect(fields.name).toBeRequired()
    expect(fields.phone).toBeRequired()
    expect(fields.comment).not.toBeRequired()
    expect(fields.consent).toBeRequired()
    expect(fields.consent.labels?.[0]).toHaveTextContent('Leí y acepto el aviso de privacidad *')
    expect(fields.name.labels?.[0]).toHaveTextContent('Nombre *')
    expect(fields.phone.labels?.[0]).toHaveTextContent('Teléfono a 10 dígitos *')
    expect(fields.comment.labels?.[0]).toHaveTextContent('Comentario Opcional')
  })

  it('shows no errors before the visitor touches anything', () => {
    setup()
    expect(screen.queryByText('Escribe tu nombre.')).not.toBeInTheDocument()
    expect(screen.queryByText('Escribe tu teléfono.')).not.toBeInTheDocument()
  })

  it('on an empty submit shows the errors under each field and focuses the first', () => {
    const fields = setup()
    fields.submit()

    expect(screen.getByText('Escribe tu nombre.')).toHaveAttribute('id', 'c-name-error')
    expect(screen.getByText('Escribe tu teléfono.')).toHaveAttribute('id', 'c-phone-error')
    expect(fields.name).toHaveAttribute('aria-invalid', 'true')
    expect(fields.name).toHaveAccessibleDescription('Escribe tu nombre.')
    expect(fields.name).toHaveFocus()
    expect(fields.dialog).not.toHaveAttribute('open')
  })

  it('shows a field error when leaving that field', () => {
    const fields = setup()
    fireEvent.blur(fields.phone)
    expect(screen.getByText('Escribe tu teléfono.')).toBeInTheDocument()
    expect(screen.queryByText('Escribe tu nombre.')).not.toBeInTheDocument()
  })

  it('requires at least three letters in the name', () => {
    const fields = setup()
    type(fields.name, ' Al ')
    fireEvent.blur(fields.name)
    expect(screen.getByText('Tu nombre debe tener al menos 3 letras.')).toBeInTheDocument()

    type(fields.name, 'Ana')
    expect(screen.queryByText('Tu nombre debe tener al menos 3 letras.')).not.toBeInTheDocument()
    expect(fields.name).not.toHaveAttribute('aria-invalid')
  })

  it('rejects names over 80 characters, also capped on the input', () => {
    const fields = setup()
    expect(fields.name).toHaveAttribute('maxlength', '80')

    type(fields.name, 'a'.repeat(81))
    fireEvent.blur(fields.name)
    expect(screen.getByText('Tu nombre admite hasta 80 caracteres.')).toBeInTheDocument()

    type(fields.name, 'a'.repeat(80))
    expect(screen.queryByText('Tu nombre admite hasta 80 caracteres.')).not.toBeInTheDocument()
  })

  it.each(['12345 !!!', 'Ana <b>López</b>', '<img src=x onerror=alert(1)>', 'Ana; DROP TABLE'])(
    'rejects the name "%s" for characters that do not belong in a name',
    (value) => {
      const fields = setup()
      type(fields.name, value)
      type(fields.phone, '5512345678')
      fields.submit()

      expect(
        screen.getByText('Tu nombre solo puede llevar letras, espacios, guiones y apóstrofos.'),
      ).toBeInTheDocument()
      expect(fields.name).toHaveFocus()
      expect(fields.dialog).not.toHaveAttribute('open')
    },
  )

  it.each(['María-José Núñez', "Ana O'Brien", 'Ana O’Brien', 'Ma. del Carmen Peña', 'Zoë Ångström'])(
    'accepts the name "%s"',
    (value) => {
      const fields = setup()
      type(fields.name, value)
      type(fields.phone, '5512345678')
      fields.submit()

      expect(fields.dialog).toHaveAttribute('open')
      expect(within(fields.dialog).getByText(value)).toBeInTheDocument()
    },
  )

  it.each(['<script>55-12 abc 34;DROP 5678</script>', '55 1234 5678 ext', '+52 55 1234 5678'])(
    'rejects the phone "%s" even though it contains ten digits',
    (value) => {
      const fields = setup()
      type(fields.name, 'Ana López')
      type(fields.phone, value)
      fields.submit()

      expect(
        screen.getByText('El teléfono solo puede llevar números, espacios, guiones y paréntesis.'),
      ).toBeInTheDocument()
      expect(fields.phone).toHaveFocus()
      expect(fields.dialog).not.toHaveAttribute('open')
    },
  )

  it('treats a whitespace-only phone as empty and caps the input length', () => {
    const fields = setup()
    expect(fields.phone).toHaveAttribute('maxlength', '20')

    type(fields.phone, '   ')
    fireEvent.blur(fields.phone)
    expect(screen.getByText('Escribe tu teléfono.')).toBeInTheDocument()
  })

  it('requires ten digits in the phone and says how many were typed', () => {
    const fields = setup()
    type(fields.name, 'Ana López')
    type(fields.phone, '55 1234 56')
    fields.submit()

    expect(screen.getByText('El teléfono debe tener 10 dígitos. Escribiste 8.')).toBeInTheDocument()
    expect(fields.phone).toHaveFocus()
    expect(fields.dialog).not.toHaveAttribute('open')
  })

  it('limits the comment to 300 characters and warns while typing', () => {
    const fields = setup()
    fillValid(fields)
    type(fields.comment, 'a'.repeat(301))

    expect(
      screen.getByText('El comentario admite hasta 300 caracteres. Llevas 301.'),
    ).toBeInTheDocument()

    fields.submit()
    expect(fields.comment).toHaveFocus()
    expect(fields.dialog).not.toHaveAttribute('open')

    type(fields.comment, 'a'.repeat(300))
    expect(screen.queryByText(/El comentario admite/)).not.toBeInTheDocument()
  })
})

describe('Contact: privacy notice', () => {
  it('blocks booking without consent and moves focus to the checkbox', () => {
    const fields = setup('', { consent: false })
    type(fields.name, 'Ana López')
    type(fields.phone, '55 1234 5678')
    expect(screen.queryByText(CONSENT_ERROR)).not.toBeInTheDocument()

    fields.submit()
    expect(screen.getByText(CONSENT_ERROR)).toHaveAttribute('id', 'c-consent-error')
    expect(fields.consent).toHaveAttribute('aria-invalid', 'true')
    expect(fields.consent).toHaveAccessibleDescription(CONSENT_ERROR)
    expect(fields.consent).toHaveFocus()
    expect(fields.dialog).not.toHaveAttribute('open')
  })

  it('clears the error and allows booking once consent is given', () => {
    const fields = setup('', { consent: false })
    type(fields.name, 'Ana López')
    type(fields.phone, '55 1234 5678')
    fields.submit()

    fireEvent.click(fields.consent)
    expect(fields.consent).toBeChecked()
    expect(screen.queryByText(CONSENT_ERROR)).not.toBeInTheDocument()
    expect(fields.consent).not.toHaveAttribute('aria-invalid')

    fields.submit()
    expect(fields.dialog).toHaveAttribute('open')
  })

  it('warns as soon as the checkbox is unticked', () => {
    const fields = setup()
    fireEvent.click(fields.consent)
    expect(fields.consent).not.toBeChecked()
    expect(screen.getByText(CONSENT_ERROR)).toBeInTheDocument()
  })

  it('with other errors, focuses the topmost field first', () => {
    const fields = setup('', { consent: false })
    fields.submit()
    expect(screen.getByText(CONSENT_ERROR)).toBeInTheDocument()
    expect(fields.name).toHaveFocus()
  })

  it('opens the full notice without ticking the checkbox or submitting the form', () => {
    const fields = setup('', { consent: false })
    fireEvent.click(screen.getByRole('button', { name: 'Leer el aviso de privacidad' }))

    expect(fields.privacy).toHaveAttribute('open')
    expect(fields.consent).not.toBeChecked()
    expect(fields.dialog).not.toHaveAttribute('open')

    const notice = within(fields.privacy)
    expect(notice.getByRole('heading', { name: 'Aviso de privacidad' })).toBeInTheDocument()
    expect(notice.getByText(`Última actualización: ${privacyNotice.updated}`)).toBeInTheDocument()
    for (const section of privacyNotice.sections) {
      expect(notice.getByRole('heading', { name: section.title })).toBeInTheDocument()
      expect(notice.getByText(section.body)).toBeInTheDocument()
    }
    expect(notice.getByText(new RegExp(contact.email))).toBeInTheDocument()
  })

  it('closes the notice with its button or an outside click, but not an inside click', () => {
    const fields = setup()
    const open = () =>
      fireEvent.click(screen.getByRole('button', { name: 'Leer el aviso de privacidad' }))

    open()
    fireEvent.click(within(fields.privacy).getByRole('heading', { name: 'Aviso de privacidad' }))
    expect(fields.privacy).toHaveAttribute('open')

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar aviso' }))
    expect(fields.privacy).not.toHaveAttribute('open')

    open()
    fireEvent.click(fields.privacy)
    expect(fields.privacy).not.toHaveAttribute('open')
  })
})

describe('Contact: review and send', () => {
  it('opens the review dialog with the typed data', () => {
    const fields = setup('tulipan')
    fillValid(fields)
    type(fields.comment, '  Solo puedo ir en sábado  ')
    fireEvent.click(screen.getByRole('radio', { name: 'WhatsApp' }))
    fields.submit()

    expect(fields.dialog).toHaveAttribute('open')
    const summary = within(fields.dialog)
    expect(summary.getByRole('heading', { name: 'Revisa tus datos' })).toBeInTheDocument()
    expect(summary.getByText('Ana López')).toBeInTheDocument()
    expect(summary.getByText('55 1234 5678')).toBeInTheDocument()
    expect(summary.getByText('Tulipán')).toBeInTheDocument()
    expect(summary.getByText('WhatsApp')).toBeInTheDocument()
    expect(summary.getByText('Solo puedo ir en sábado')).toBeInTheDocument()
    expect(summary.getByText('Aceptado')).toBeInTheDocument()
  })

  it('summarizes empty optional fields and formats the phone', () => {
    const fields = setup()
    type(fields.name, 'Ana López')
    type(fields.phone, '5512345678')
    fields.submit()

    const summary = within(fields.dialog)
    expect(summary.getByText('55 1234 5678')).toBeInTheDocument()
    expect(summary.getByText('Todavía no lo sé')).toBeInTheDocument()
    expect(summary.getByText('Llamada')).toBeInTheDocument()
    expect(summary.getByText('Sin comentario')).toBeInTheDocument()
  })

  it('cleans values before showing them: extra spaces and phone format', () => {
    const fields = setup()
    type(fields.name, '  Ana   María \t López ')
    type(fields.phone, ' (55) 1234-5678 ')
    type(fields.comment, '  ')
    fields.submit()

    const summary = within(fields.dialog)
    expect(summary.getByText('Ana María López')).toBeInTheDocument()
    expect(summary.getByText('55 1234 5678')).toBeInTheDocument()
    expect(summary.getByText('Sin comentario')).toBeInTheDocument()
  })

  it('shows any HTML typed in the comment as plain text', () => {
    const fields = setup()
    const payload = '<img src=x onerror="alert(1)"><script>alert(2)</script>'
    fillValid(fields)
    type(fields.comment, payload)
    fields.submit()

    expect(within(fields.dialog).getByText(payload)).toBeInTheDocument()
    expect(fields.dialog.querySelector('img, script')).not.toBeInTheDocument()
  })

  it('discards a condominium that does not exist even if the list is tampered with', () => {
    const fields = setup('tulipan')
    const forged = document.createElement('option')
    forged.value = '../../admin'
    fields.project.append(forged)

    fillValid(fields)
    type(fields.project, '../../admin')
    expect(fields.project).toHaveValue('')

    fields.submit()
    expect(within(fields.dialog).getByText('Todavía no lo sé')).toBeInTheDocument()
  })

  it('reflects in the summary the condominium chosen in the form', () => {
    const fields = setup()
    fillValid(fields)
    type(fields.project, 'jacaranda')
    expect(fields.project).toHaveValue('jacaranda')

    fields.submit()
    expect(within(fields.dialog).getByText('Jacaranda')).toBeInTheDocument()
  })

  it('"Corregir datos" closes the dialog and keeps what was typed', () => {
    const fields = setup()
    fillValid(fields)
    fields.submit()
    fireEvent.click(screen.getByRole('button', { name: 'Corregir datos' }))

    expect(fields.dialog).not.toHaveAttribute('open')
    expect(fields.name).toHaveValue('Ana López')
    expect(fields.phone).toHaveValue('55 1234 5678')
  })

  it('closes on a click outside the dialog, but not inside', () => {
    const fields = setup()
    fillValid(fields)
    fields.submit()

    fireEvent.click(within(fields.dialog).getByRole('heading', { name: 'Revisa tus datos' }))
    expect(fields.dialog).toHaveAttribute('open')

    // A backdrop click targets the <dialog> itself.
    fireEvent.click(fields.dialog)
    expect(fields.dialog).not.toHaveAttribute('open')
  })

  it('on send clears the form, stores nothing and shows the notice for six seconds', () => {
    vi.useFakeTimers()
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const fields = setup('bugambilia')
    fillValid(fields)
    type(fields.comment, 'Solo puedo ir en sábado')
    fireEvent.click(screen.getByRole('radio', { name: 'WhatsApp' }))
    fields.submit()
    fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    expect(fields.dialog).not.toHaveAttribute('open')
    expect(fields.name).toHaveValue('')
    expect(fields.phone).toHaveValue('')
    expect(fields.comment).toHaveValue('')
    expect(fields.project).toHaveValue('')
    expect(screen.getByRole('radio', { name: 'Llamada' })).toBeChecked()
    expect(fields.consent).not.toBeChecked()
    expect(screen.queryByText(CONSENT_ERROR)).not.toBeInTheDocument()
    expect(screen.queryByText('Escribe tu nombre.')).not.toBeInTheDocument()
    expect(setItem).not.toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent(NOTICE)
    expect(status.firstElementChild).toHaveStyle({ animationDuration: '6000ms' })

    act(() => vi.advanceTimersByTime(5999))
    expect(status).toHaveTextContent(NOTICE)
    act(() => vi.advanceTimersByTime(1))
    expect(status).toBeEmptyDOMElement()
  })

  it('a second send restarts the notice and its six-second countdown', () => {
    vi.useFakeTimers()
    const fields = setup()
    const send = () => {
      fillValid(fields)
      fields.submit()
      fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))
    }
    const status = screen.getByRole('status')

    send()
    const firstNotice = status.firstElementChild
    act(() => vi.advanceTimersByTime(4000))
    send()

    expect(status.firstElementChild).not.toBe(firstNotice)
    act(() => vi.advanceTimersByTime(4000))
    expect(status).toHaveTextContent(NOTICE)
    act(() => vi.advanceTimersByTime(2000))
    expect(status).toBeEmptyDOMElement()
  })

  it('cancels the pending notice once unmounted', () => {
    vi.useFakeTimers()
    const fields = setup()
    fillValid(fields)
    fields.submit()
    fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    fields.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
