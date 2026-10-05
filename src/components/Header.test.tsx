import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { navLinks } from '../data/site.ts'
import { Header } from './Header.tsx'

describe('Header', () => {
  it('shows the navigation links and the booking button', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })

    for (const link of navLinks) {
      expect(within(nav).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href)
    }
    expect(within(nav).getByRole('link', { name: 'Agendar visita' })).toHaveAttribute(
      'href',
      '/contacto',
    )
    expect(screen.getByRole('link', { name: 'Tu Nuevo Hogar, inicio' })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('offers the theme toggle outside the collapsible menu', () => {
    render(<Header />)
    const toggle = screen.getByRole('button', { name: 'Cambiar a tema oscuro' })
    expect(screen.getByRole('navigation', { name: 'Principal' })).not.toContainElement(toggle)
  })

  it('opens and closes the menu with the button', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const toggle = screen.getByRole('button', { name: 'Menú' })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(nav).not.toHaveClass('is-open')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveTextContent('Cerrar')
    expect(nav).toHaveClass('is-open')

    await user.click(toggle)
    expect(toggle).toHaveTextContent('Menú')
    expect(nav).not.toHaveClass('is-open')
  })

  it('closes the menu when a link is chosen, but not when its background is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })

    await user.click(screen.getByRole('button', { name: 'Menú' }))
    await user.click(nav)
    expect(nav).toHaveClass('is-open')

    await user.click(within(nav).getByRole('link', { name: 'Créditos' }))
    expect(nav).not.toHaveClass('is-open')
  })
})
