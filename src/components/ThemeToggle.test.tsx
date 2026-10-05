import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from './ThemeToggle.tsx'

describe('ThemeToggle', () => {
  it('starts in the light theme and offers to switch to dark', () => {
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button', { name: 'Cambiar a tema oscuro' })).toBeInTheDocument()
  })

  it('starts in the dark theme when the system prefers it', () => {
    vi.mocked(window.matchMedia).mockReturnValueOnce({ matches: true } as MediaQueryList)
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: 'Cambiar a tema claro' })).toBeInTheDocument()
  })

  it('starts in the saved theme', () => {
    window.localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('switches theme, relabels itself and swaps its icon on each click', () => {
    const { container } = render(<ThemeToggle />)
    const button = screen.getByRole('button')
    const icon = () => container.querySelector('svg')?.innerHTML

    const moon = icon()
    fireEvent.click(button)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(button).toHaveAccessibleName('Cambiar a tema claro')
    expect(icon()).not.toBe(moon)

    fireEvent.click(button)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(button).toHaveAccessibleName('Cambiar a tema oscuro')
    expect(icon()).toBe(moon)
  })

  it('comes back in the chosen theme on the next visit', () => {
    const firstVisit = render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button'))
    firstVisit.unmount()
    delete document.documentElement.dataset.theme

    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: 'Cambiar a tema claro' })).toBeInTheDocument()
  })

  it('keeps working for the visit when the choice cannot be saved', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button'))
    expect(document.documentElement.dataset.theme).toBe('dark')

    vi.restoreAllMocks()
  })

  it('saves the theme only once the visitor chooses one', () => {
    render(<ThemeToggle />)
    expect(window.localStorage.getItem('theme')).toBeNull()

    fireEvent.click(screen.getByRole('button'))
    expect(window.localStorage.getItem('theme')).toBe('dark')

    fireEvent.click(screen.getByRole('button'))
    expect(window.localStorage.getItem('theme')).toBe('light')
  })
})
