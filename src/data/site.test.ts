import { describe, expect, it } from 'vitest'
import {
  contact,
  creditTypes,
  faqs,
  formatMillions,
  formatMXN,
  isProjectId,
  loanTerms,
  navLinks,
  privacyNotice,
  projects,
  promotions,
  team,
  testimonials,
} from './site.ts'

describe('formatMXN', () => {
  it('formats pesos without cents', () => {
    expect(formatMXN(1_480_000)).toBe('$1,480,000')
    expect(formatMXN(11_559.4)).toBe('$11,559')
  })
})

describe('formatMillions', () => {
  it('abbreviates in millions from one million up', () => {
    expect(formatMillions(2_650_000)).toBe('$2.65 M')
    expect(formatMillions(1_000_000)).toBe('$1.00 M')
  })

  it('abbreviates in thousands below one million', () => {
    expect(formatMillions(980_000)).toBe('$980 mil')
  })
})

describe('isProjectId', () => {
  it('accepts only ids of existing projects', () => {
    for (const project of projects) {
      expect(isProjectId(project.id)).toBe(true)
    }
    expect(isProjectId('')).toBe(false)
    expect(isProjectId('../../admin')).toBe(false)
    expect(isProjectId('Tulipán')).toBe(false)
  })
})

describe('content consistency', () => {
  const projectNames = projects.map((project) => project.name)
  const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/

  it('gives every project a positive price, sizes and three facade colours', () => {
    for (const project of projects) {
      expect(project.price, project.name).toBeGreaterThan(0)
      expect(project.builtArea, project.name).toBeGreaterThan(0)
      expect(project.lotArea, project.name).toBeGreaterThanOrEqual(project.builtArea / 2)
      expect(project.amenities.length, project.name).toBeGreaterThan(0)
      for (const color of Object.values(project.colors)) {
        expect(color, project.name).toMatch(HEX_COLOR)
      }
    }
  })

  it('keeps Tulipán as the most expensive and largest house', () => {
    const tulipan = projects.find((project) => project.id === 'tulipan')
    expect(tulipan?.price).toBe(Math.max(...projects.map((project) => project.price)))
    expect(tulipan?.builtArea).toBe(Math.max(...projects.map((project) => project.builtArea)))
  })

  it('ties each promotion to projects that exist, with one for Tulipán', () => {
    for (const promo of promotions) {
      const named = projectNames.filter((name) => promo.appliesTo.includes(name))
      expect(named.length, promo.title).toBeGreaterThan(0)
    }
    expect(promotions.some((promo) => promo.appliesTo === 'Tulipán')).toBe(true)
    expect(new Set(promotions.map((promo) => promo.id)).size).toBe(promotions.length)
  })

  it('has ten testimonials, none from a house still in presale', () => {
    const presale = projects.filter((p) => p.statusLabel === 'Preventa').map((p) => p.name)

    expect(testimonials).toHaveLength(10)
    expect(new Set(testimonials.map((item) => item.family)).size).toBe(10)
    for (const item of testimonials) {
      expect(projectNames, item.family).toContain(item.project)
      expect(presale, item.family).not.toContain(item.project)
    }
  })

  it('has six team members with distinct names and complete avatars', () => {
    expect(team).toHaveLength(6)
    expect(new Set(team.map((member) => member.name)).size).toBe(6)
    for (const member of team) {
      expect(member.avatar.skin, member.name).toMatch(HEX_COLOR)
      expect(member.avatar.hair, member.name).toMatch(HEX_COLOR)
      expect(member.avatar.shirt, member.name).toMatch(HEX_COLOR)
    }
  })

  it('offers credit types with sane reference rates and ascending loan terms', () => {
    expect(creditTypes.map((credit) => credit.id)).toEqual([
      'infonavit',
      'fovissste',
      'bank',
      'cofinavit',
    ])
    for (const credit of creditTypes) {
      expect(credit.referenceRate, credit.name).toBeGreaterThan(0)
      expect(credit.referenceRate, credit.name).toBeLessThanOrEqual(30)
    }
    expect(loanTerms).toEqual([...loanTerms].sort((a, b) => a - b))
  })

  it('lists opening hours for the week, closed on Sundays', () => {
    expect(contact.hours.map((slot) => slot.days)).toEqual([
      'Lunes a viernes',
      'Sábados',
      'Domingos',
    ])
    expect(contact.hours[2].time).toBe('Cerrado')
  })

  it('keeps the phone link and the map links well formed', () => {
    expect(contact.phoneHref).toBe(`tel:+52${contact.phone.replace(/\D/g, '')}`)
    expect(new URL(contact.map.embedUrl).hostname).toBe('www.openstreetmap.org')
    expect(new URL(contact.map.linkUrl).hostname).toBe('www.openstreetmap.org')
  })

  it('names the responsible party, the data, its use and the visitor rights in the privacy notice', () => {
    const text = privacyNotice.sections.map((section) => `${section.title} ${section.body}`).join(' ')

    expect(privacyNotice.sections).toHaveLength(6)
    expect(text).toContain(contact.address[0])
    expect(text).toContain(contact.email)
    expect(text).toContain('ARCO')
    expect(text).toMatch(/nombre.*teléfono/)
  })

  it('answers every frequent question', () => {
    expect(faqs).toHaveLength(8)
    for (const faq of faqs) {
      expect(faq.question).toMatch(/^¿.+\?$/)
      expect(faq.answer.length, faq.question).toBeGreaterThan(40)
    }
  })
})

describe('content', () => {
  it('builds the WhatsApp link from the bot number and the opening message', () => {
    const url = new URL(contact.whatsappHref)
    expect(url.origin + url.pathname).toBe('https://wa.me/15551601886')
    expect(url.searchParams.get('text')).toBe('Hola, me gustaría agendar una visita')
  })

  it('lists four projects with unique ids, Tulipán first', () => {
    expect(projects.map((p) => p.id)).toEqual(['tulipan', 'bugambilia', 'jacaranda', 'cempasuchil'])
  })

  it('builds the delivery answer from the projects', () => {
    const answer = faqs.find((faq) => faq.question === '¿Cuándo me entregan la casa?')?.answer
    for (const project of projects) {
      expect(answer).toContain(`${project.name}, ${project.delivery.toLowerCase()}`)
    }
  })

  it('links the navigation to page sections', () => {
    expect(navLinks.map((link) => link.href)).toEqual([
      '#proyectos',
      '#promociones',
      '#creditos',
      '#equipo',
      '#ubicacion',
    ])
  })
})
