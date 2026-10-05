import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatMXN, projects } from '../data/site.ts'
import { Projects } from './Projects.tsx'

describe('Projects', () => {
  it('shows one card per project with price, status, specs and amenities', () => {
    render(<Projects onAskAbout={vi.fn()} />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(projects.length)

    projects.forEach((project, index) => {
      const card = within(cards[index])
      expect(cards[index]).toHaveAttribute('id', `proyecto-${project.id}`)
      expect(card.getByRole('heading', { name: project.name })).toBeInTheDocument()
      expect(card.getByText(formatMXN(project.price))).toBeInTheDocument()
      expect(card.getByText(project.statusLabel)).toHaveClass(`chip--${project.status}`)
      expect(card.getByText(`${project.bedrooms}, ${project.bathrooms}`)).toBeInTheDocument()
      expect(card.getByText(`${project.builtArea} m²`)).toBeInTheDocument()
      for (const amenity of project.amenities) {
        expect(card.getByText(amenity)).toBeInTheDocument()
      }
    })
  })

  it('reports which project the visitor asked to visit', async () => {
    const onAskAbout = vi.fn()
    render(<Projects onAskAbout={onAskAbout} />)

    const cta = screen.getByRole('link', { name: 'Agendar visita a Jacaranda' })
    expect(cta).toHaveAttribute('href', '/contacto')

    await userEvent.setup().click(cta)
    expect(onAskAbout).toHaveBeenCalledExactlyOnceWith('jacaranda')
  })
})
