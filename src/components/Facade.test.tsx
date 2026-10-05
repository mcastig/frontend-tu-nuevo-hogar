import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { FacadeVariant } from '../data/site.ts'
import { Facade } from './Facade.tsx'

const colors = { wall: '#111111', band: '#222222', door: '#333333' }

function renderFacade(variant: FacadeVariant) {
  const { container } = render(<Facade variant={variant} colors={colors} />)
  return container.querySelector('svg') as SVGSVGElement
}

describe('Facade', () => {
  it('passes the project colours as style variables', () => {
    const svg = renderFacade('two-story')
    expect(svg.style.getPropertyValue('--wall')).toBe('#111111')
    expect(svg.style.getPropertyValue('--band')).toBe('#222222')
    expect(svg.style.getPropertyValue('--door')).toBe('#333333')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it.each([
    ['a dark door', '#1B2559', '#f8f6f1'],
    ['a black door', '#000000', '#f8f6f1'],
    ['a yellow door', '#F5B82E', '#1b2559'],
    ['an off-white door', '#F8F6F1', '#1b2559'],
  ])('gives %s a knob that stands out from it', (_, door, knob) => {
    const { container } = render(<Facade variant="one-story" colors={{ ...colors, door }} />)
    const svg = container.querySelector('svg') as SVGSVGElement

    expect(svg.style.getPropertyValue('--knob')).toBe(knob)
    expect(svg.querySelectorAll('.facade__knob')).toHaveLength(1)
  })

  it.each<[FacadeVariant, number]>([
    ['two-story', 3],
    ['balcony', 2],
    ['one-story', 1],
    ['residence', 3],
  ])('draws the windows of the %s variant', (variant, windows) => {
    const svg = renderFacade(variant)
    expect(svg.querySelectorAll('.facade__glass')).toHaveLength(windows)
    expect(svg.querySelector('.facade__door path')).toBeInTheDocument()
  })

  it('draws a balcony only on variants that have one', () => {
    // With a balcony there are two ink groups (water tank and railing); without, only the tank.
    expect(renderFacade('balcony').querySelectorAll('.facade__ink')).toHaveLength(2)
    expect(renderFacade('one-story').querySelectorAll('.facade__ink')).toHaveLength(1)
  })
})
