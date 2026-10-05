import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { contact, isProjectId, projects } from '../data/site.ts'
import type { ProjectId } from '../data/site.ts'
import { closeOnBackdropClick } from './dialog.ts'
import { PrivacyNotice } from './PrivacyNotice.tsx'
import { WhatsAppIcon } from './WhatsApp.tsx'

type Values = { name: string; phone: string; comment: string }
type Field = keyof Values | 'consent'
type Errors = Partial<Record<Field, string>>
type Channel = 'call' | 'whatsapp'

const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'call', label: 'Llamada' },
  { id: 'whatsapp', label: 'WhatsApp' },
]

const EMPTY_VALUES: Values = { name: '', phone: '', comment: '' }
const NOTHING_TOUCHED: Record<Field, boolean> = {
  name: false,
  phone: false,
  comment: false,
  consent: false,
}
const ALL_TOUCHED: Record<Field, boolean> = { name: true, phone: true, comment: true, consent: true }
const FIELD_ORDER: Field[] = ['name', 'phone', 'comment', 'consent']

const NAME_MIN = 3
const NAME_MAX = 80
const PHONE_DIGITS = 10
// Room for spaces, hyphens and parentheses around the ten digits.
const PHONE_MAX = 20
const COMMENT_MAX = 300
const SENT_NOTICE_MS = 6000

const NON_DIGITS = /\D/g
const WHITESPACE_RUNS = /\s+/g
// Letters from any alphabet (accents included), spaces, periods, hyphens and apostrophes.
const NAME_ALLOWED = /^[\p{L}\p{M}'’ .-]+$/u
const PHONE_ALLOWED = /^[\d\s()-]+$/

// The only thing that should leave the form: trimmed, normalized values.
// A backend must repeat these checks; browser-side validation can be bypassed.
function clean(values: Values): Values {
  return {
    name: values.name.trim().replace(WHITESPACE_RUNS, ' '),
    phone: values.phone.replace(NON_DIGITS, ''),
    comment: values.comment.trim(),
  }
}

function validate(values: Values, consent: boolean): Errors {
  const errors: Errors = {}
  const { name, phone } = clean(values)

  if (name === '') errors.name = 'Escribe tu nombre.'
  else if (name.length < NAME_MIN) errors.name = `Tu nombre debe tener al menos ${NAME_MIN} letras.`
  else if (name.length > NAME_MAX) errors.name = `Tu nombre admite hasta ${NAME_MAX} caracteres.`
  else if (!NAME_ALLOWED.test(name))
    errors.name = 'Tu nombre solo puede llevar letras, espacios, guiones y apóstrofos.'

  if (values.phone.trim() === '') errors.phone = 'Escribe tu teléfono.'
  else if (!PHONE_ALLOWED.test(values.phone))
    errors.phone = 'El teléfono solo puede llevar números, espacios, guiones y paréntesis.'
  else if (phone.length !== PHONE_DIGITS)
    errors.phone = `El teléfono debe tener ${PHONE_DIGITS} dígitos. Escribiste ${phone.length}.`

  if (values.comment.length > COMMENT_MAX)
    errors.comment = `El comentario admite hasta ${COMMENT_MAX} caracteres. Llevas ${values.comment.length}.`

  if (!consent) errors.consent = 'Acepta el aviso de privacidad para agendar tu cita.'

  return errors
}

function formatPhone(digits: string) {
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`
}

type ContactProps = {
  interest: ProjectId | ''
  onInterestChange: (id: ProjectId | '') => void
}

export function Contact({ interest, onInterestChange }: ContactProps) {
  const [values, setValues] = useState(EMPTY_VALUES)
  const [touched, setTouched] = useState(NOTHING_TOUCHED)
  const [channel, setChannel] = useState<Channel>('call')
  const [consent, setConsent] = useState(false)
  // 0 = notice hidden; each send uses a new number so the animation restarts.
  const [notice, setNotice] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const privacyRef = useRef<HTMLDialogElement>(null)
  const noticeTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(noticeTimer.current), [])

  const errors = validate(values, consent)
  const cleaned = clean(values)
  const shown: Errors = {
    name: touched.name ? errors.name : undefined,
    phone: touched.phone ? errors.phone : undefined,
    comment: touched.comment ? errors.comment : undefined,
    consent: touched.consent ? errors.consent : undefined,
  }
  const channelLabel = CHANNELS.find((c) => c.id === channel)?.label
  const projectName = projects.find((p) => p.id === interest)?.name ?? 'Todavía no lo sé'

  function setField(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function touch(field: Field) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const firstInvalid = FIELD_ORDER.find((field) => errors[field])
    if (firstInvalid) {
      setTouched(ALL_TOUCHED)
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    dialogRef.current?.showModal()
  }

  function handleSend() {
    // Demo: nothing is stored or sent anywhere; the form is only cleared.
    // When wiring a backend, send `cleaned`, `interest` and `channel`, never the raw `values`.
    setValues(EMPTY_VALUES)
    setTouched(NOTHING_TOUCHED)
    setChannel('call')
    setConsent(false)
    onInterestChange('')
    setNotice((current) => current + 1)
    window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(0), SENT_NOTICE_MS)
    dialogRef.current?.close()
  }

  return (
    <section id="contacto" className="section section--indigo on-dark">
      <div className="wrap contact">
        <div>
          <header className="section__head">
            <p className="section__label">Contacto</p>
            <h2 className="section__title">Agenda tu visita</h2>
            <p className="section__lead">
              El recorrido dura unos 40 minutos e incluye las casas muestra de Bugambilia y
              Jacaranda. No necesitas traer documentos.
            </p>
          </header>

          <dl className="contact__list">
            <div>
              <dt>Centro de ventas</dt>
              <dd>
                {contact.address[0]}
                <br />
                {contact.address[1]}
              </dd>
            </div>
            <div>
              <dt>Horario</dt>
              <dd>
                <ul className="hours">
                  {contact.hours.map((slot) => (
                    <li key={slot.days}>
                      <span>{slot.days}</span>
                      <span>{slot.time}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>
                <a href={contact.phoneHref}>{contact.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>
                <a
                  className="contact__whatsapp"
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon /> {contact.whatsapp}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <p className="form__status" role="status">
            {notice ? (
              <span
                key={notice}
                className="form__notice"
                style={{ animationDuration: `${SENT_NOTICE_MS}ms` }}
              >
                Solicitud enviada. Esta página es una demostración: no guardamos tus datos.
              </span>
            ) : null}
          </p>

          <p className="form__legend">
            Los campos con <span className="req">*</span> son obligatorios.
          </p>

          <div className="field">
            <label htmlFor="c-name">
              Nombre <span className="req">*</span>
            </label>
            <input
              id="c-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={NAME_MAX}
              required
              value={values.name}
              aria-invalid={shown.name ? true : undefined}
              aria-describedby={shown.name ? 'c-name-error' : undefined}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={() => touch('name')}
            />
            {shown.name ? (
              <p id="c-name-error" className="field__error">
                {shown.name}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="c-phone">
              Teléfono a 10 dígitos <span className="req">*</span>
            </label>
            <input
              id="c-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="55 1234 5678"
              maxLength={PHONE_MAX}
              required
              value={values.phone}
              aria-invalid={shown.phone ? true : undefined}
              aria-describedby={shown.phone ? 'c-phone-error' : undefined}
              onChange={(e) => setField('phone', e.target.value)}
              onBlur={() => touch('phone')}
            />
            {shown.phone ? (
              <p id="c-phone-error" className="field__error">
                {shown.phone}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="c-project">Condominio que te interesa</label>
            <select
              id="c-project"
              name="project"
              value={interest}
              onChange={(e) => onInterestChange(isProjectId(e.target.value) ? e.target.value : '')}
            >
              <option value="">Todavía no lo sé</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="field">
            <legend>¿Cómo te contactamos?</legend>
            <div className="choices">
              {CHANNELS.map((option) => (
                <label key={option.id} className="choice">
                  <input
                    type="radio"
                    name="channel"
                    value={option.id}
                    checked={option.id === channel}
                    onChange={() => setChannel(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="c-comment">
              Comentario <small>Opcional</small>
            </label>
            <textarea
              id="c-comment"
              name="comment"
              rows={3}
              placeholder="Por ejemplo: solo puedo ir en sábado"
              value={values.comment}
              aria-invalid={shown.comment ? true : undefined}
              aria-describedby={shown.comment ? 'c-comment-error' : undefined}
              onChange={(e) => {
                setField('comment', e.target.value)
                touch('comment')
              }}
            />
            {shown.comment ? (
              <p id="c-comment-error" className="field__error">
                {shown.comment}
              </p>
            ) : null}
          </div>

          <div className="field consent">
            <label className="choice">
              <input
                type="checkbox"
                name="consent"
                required
                checked={consent}
                aria-invalid={shown.consent ? true : undefined}
                aria-describedby={shown.consent ? 'c-consent-error' : undefined}
                onChange={(e) => {
                  setConsent(e.target.checked)
                  touch('consent')
                }}
              />
              <span>
                Leí y acepto el aviso de privacidad <span className="req">*</span>
              </span>
            </label>
            <button
              type="button"
              className="consent__read"
              onClick={() => privacyRef.current?.showModal()}
            >
              Leer el aviso de privacidad
            </button>
            {shown.consent ? (
              <p id="c-consent-error" className="field__error">
                {shown.consent}
              </p>
            ) : null}
          </div>

          <button type="submit" className="btn btn--pink form__submit">
            Agendar Cita
          </button>
        </form>
      </div>

      <dialog
        ref={dialogRef}
        className="confirm"
        aria-labelledby="confirm-title"
        onClick={closeOnBackdropClick}
      >
        <h3 id="confirm-title" className="confirm__title">
          Revisa tus datos
        </h3>
        <p>Si todo está bien, envía la solicitud. Si no, vuelve al formulario y corrígela.</p>

        <dl className="confirm__list">
          <div>
            <dt>Nombre</dt>
            <dd>{cleaned.name}</dd>
          </div>
          <div>
            <dt>Teléfono</dt>
            <dd>{formatPhone(cleaned.phone)}</dd>
          </div>
          <div>
            <dt>Condominio</dt>
            <dd>{projectName}</dd>
          </div>
          <div>
            <dt>Te contactamos por</dt>
            <dd>{channelLabel}</dd>
          </div>
          <div>
            <dt>Comentario</dt>
            <dd className="confirm__comment">{cleaned.comment || 'Sin comentario'}</dd>
          </div>
          <div>
            <dt>Aviso de privacidad</dt>
            <dd>Aceptado</dd>
          </div>
        </dl>

        <div className="confirm__actions">
          <button type="button" className="btn btn--pink" onClick={handleSend}>
            Enviar solicitud
          </button>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => dialogRef.current?.close()}
          >
            Corregir datos
          </button>
        </div>
      </dialog>

      <PrivacyNotice ref={privacyRef} />
    </section>
  )
}
