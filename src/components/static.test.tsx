import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { contact, faqs, navLinks, projects, promotions, team } from '../data/site.ts'
import { Faq } from './Faq.tsx'
import { Footer } from './Footer.tsx'
import { Hero } from './Hero.tsx'
import { Location } from './Location.tsx'
import { Logo } from './Logo.tsx'
import { Promotions } from './Promotions.tsx'
import { Team } from './Team.tsx'
import { WhatsAppButton, WhatsAppIcon } from './WhatsApp.tsx'

describe('Logo', () => {
  it('shows the brand name', () => {
    const { container } = render(<Logo />)
    expect(container).toHaveTextContent('Tu nuevoHogar')
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('Hero', () => {
  it('shows the headline and both actions', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Aquí empieza Tu Nuevo Hogar.',
    )
    expect(screen.getByRole('link', { name: 'Ver proyectos' })).toHaveAttribute('href', '/proyectos')
    expect(screen.getByRole('link', { name: 'Simular mi crédito' })).toHaveAttribute(
      'href',
      '/creditos',
    )
  })

  it('draws the sun and the moon as decoration, hidden from assistive technology', () => {
    const { container } = render(<Hero />)
    const sky = container.querySelector('.sky')

    expect(sky).toHaveAttribute('aria-hidden', 'true')
    expect(sky?.querySelectorAll('.sky__sun line')).toHaveLength(12)
    expect(sky?.querySelector('.sky__moon .sky__crescent')).toBeInTheDocument()
    expect(sky?.querySelectorAll('.sky__star')).toHaveLength(4)
  })

  it('links each house on the street to its project and price', () => {
    render(<Hero />)
    const street = screen.getByRole('list', { name: 'Nuestros condominios' })
    const houses = within(street).getAllByRole('link')

    expect(houses.map((house) => house.getAttribute('href'))).toEqual(
      projects.map((project) => `/proyecto-${project.id}`),
    )
    expect(houses[0]).toHaveTextContent('Tulipándesde $2.65 M')
    expect(houses[3]).toHaveTextContent('Cempasúchildesde $980 mil')
  })
})

describe('Promotions', () => {
  it('lists each promotion with its validity', () => {
    render(<Promotions />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(promotions.length)

    promotions.forEach((promo, index) => {
      const item = within(items[index])
      expect(item.getByRole('heading', { name: promo.title })).toBeInTheDocument()
      expect(item.getByText(promo.appliesTo)).toBeInTheDocument()
      expect(item.getByText(promo.validity)).toBeInTheDocument()
    })
  })
})

describe('Team', () => {
  it('shows each person with their role and portrait', () => {
    const { container } = render(<Team />)
    expect(container.querySelectorAll('.avatar')).toHaveLength(team.length)

    for (const member of team) {
      expect(screen.getByRole('heading', { name: member.name })).toBeInTheDocument()
      expect(screen.getByText(member.role)).toBeInTheDocument()
      expect(container.querySelector(`.member__door--${member.color}`)).toBeInTheDocument()
    }
  })
})

describe('Location', () => {
  it('shows the address, the map and the link that opens it separately', () => {
    render(<Location />)
    expect(screen.getByText(contact.address[0], { exact: false })).toBeInTheDocument()

    const map = screen.getByTitle(/Mapa de Huichapan/)
    expect(map).toHaveAttribute('src', contact.map.embedUrl)
    expect(map).toHaveAttribute('loading', 'lazy')
    expect(map).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups')

    const link = screen.getByRole('link', { name: 'Abrir el mapa en otra pestaña' })
    expect(link).toHaveAttribute('href', contact.map.linkUrl)
    expect(link).toHaveAttribute('target', '_blank')
  })
})

describe('Faq', () => {
  it('lists every question collapsed, with its answer inside', () => {
    const { container } = render(<Faq />)
    const items = container.querySelectorAll('details')
    expect(items).toHaveLength(faqs.length)

    faqs.forEach((faq, index) => {
      expect(items[index]).not.toHaveAttribute('open')
      expect(items[index].querySelector('summary')).toHaveTextContent(faq.question)
      expect(items[index].querySelector('p')).toHaveTextContent(faq.answer)
    })
  })

  it('offers to book a visit when the question is not listed', () => {
    render(<Faq />)
    expect(screen.getByRole('link', { name: 'agenda una visita' })).toHaveAttribute(
      'href',
      '/contacto',
    )
  })
})

describe('Footer', () => {
  it('repeats the navigation and adds contact and FAQ', () => {
    render(<Footer />)
    const nav = screen.getByRole('navigation', { name: 'Pie de página' })
    const hrefs = within(nav)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))

    expect(hrefs).toEqual([...navLinks.map((link) => link.href), '/contacto', '/preguntas'])
    expect(screen.getByText(/© 2026 Tu Nuevo Hogar/)).toBeInTheDocument()
  })
})

describe('WhatsApp', () => {
  it('opens a chat with the bot in a new tab, with the greeting already typed', () => {
    render(<WhatsAppButton />)
    const link = screen.getByRole('link', { name: /WhatsApp/ })
    expect(link).toHaveTextContent('Agenda tu visita')

    expect(link).toHaveAttribute(
      'href',
      'https://wa.me/5217121006312?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20las%20casas%20de%20Tu%20Nuevo%20Hogar',
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('renders the icon as decorative', () => {
    const { container } = render(<WhatsAppIcon />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
