import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('mounts every section in navigation order', () => {
    const { container } = render(<App />)
    const sections = [...container.querySelectorAll('main > section')].map(
      (section) => section.id || section.getAttribute('aria-labelledby'),
    )

    expect(sections).toEqual([
      'inicio',
      'proyectos',
      'promociones',
      'creditos',
      'equipo',
      'testimonios-titulo',
      'ubicacion',
      'contacto',
      'preguntas',
    ])
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Pie de página' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /WhatsApp/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toHaveAttribute(
      'href',
      '#proyectos',
    )
  })

  it('points every in-page link at an element that exists', () => {
    const { container } = render(<App />)
    const targets = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].map(
      (link) => link.getAttribute('href') as string,
    )

    expect(targets.length).toBeGreaterThan(20)
    for (const target of new Set(targets)) {
      expect(container.querySelector(target), `target of ${target}`).not.toBeNull()
    }
  })

  it('has one main heading and a heading in every section', () => {
    const { container } = render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    for (const section of container.querySelectorAll('main > section')) {
      expect(section.querySelector('h1, h2'), `heading in #${section.id}`).not.toBeNull()
    }
  })

  it('opens external links in a new tab without handing over the opener', () => {
    const { container } = render(<App />)
    const external = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')]

    expect(external.length).toBeGreaterThan(0)
    for (const link of external) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.rel).toContain('noreferrer')
    }
  })

  it('switches the whole document theme from the header toggle', () => {
    render(<App />)
    expect(document.documentElement.dataset.theme).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: 'Cambiar a tema oscuro' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: 'Cambiar a tema claro' })).toBeInTheDocument()
  })

  it('keeps the floating WhatsApp link outside the main content and the footer', () => {
    const { container } = render(<App />)
    const floating = container.querySelector('.wa-float')

    expect(floating).toBeInTheDocument()
    expect(container.querySelector('main')).not.toContainElement(floating as HTMLElement)
    expect(container.querySelector('footer')).not.toContainElement(floating as HTMLElement)
  })

  it('preselects in the form the condominium picked from its card', () => {
    render(<App />)
    const select = screen.getByLabelText('Condominio que te interesa')
    expect(select).toHaveValue('')

    fireEvent.click(screen.getByRole('link', { name: 'Agendar visita a Cempasúchil' }))
    expect(select).toHaveValue('cempasuchil')

    fireEvent.change(select, { target: { value: 'tulipan' } })
    expect(select).toHaveValue('tulipan')
  })
})
