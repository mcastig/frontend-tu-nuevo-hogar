import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { testimonials } from '../data/site.ts'
import { Testimonials } from './Testimonials.tsx'

const AUTOPLAY_MS = 4500
const ITEM_WIDTH = 100
const MAX_SCROLL = 700

// jsdom neither measures nor scrolls: the track and its position are simulated.
function setup({ scrollLeft = 0, gap = '' } = {}) {
  const view = render(<Testimonials />)
  const track = screen.getByRole('list')
  const scrollTo = vi.fn()
  const scrollBy = vi.fn()

  Object.defineProperties(track, {
    scrollWidth: { value: 1000 },
    clientWidth: { value: 1000 - MAX_SCROLL },
    scrollLeft: { value: scrollLeft, writable: true },
    scrollTo: { value: scrollTo },
    scrollBy: { value: scrollBy },
  })
  Object.defineProperty(track.firstElementChild, 'offsetWidth', { value: ITEM_WIDTH })
  track.style.columnGap = gap

  const region = track.parentElement as HTMLElement
  return { ...view, track, region, scrollTo, scrollBy }
}

const next = () => fireEvent.click(screen.getByRole('button', { name: 'Testimonio siguiente' }))
const previous = () => fireEvent.click(screen.getByRole('button', { name: 'Testimonio anterior' }))
const tick = () => act(() => vi.advanceTimersByTime(AUTOPLAY_MS))

afterEach(() => {
  vi.mocked(window.matchMedia).mockClear()
})

describe('Testimonials', () => {
  it('shows all ten testimonials with family and condominium', () => {
    setup()
    expect(testimonials).toHaveLength(10)
    expect(screen.getByRole('list')).toHaveAccessibleName('10 testimonios de familias')

    for (const item of testimonials) {
      expect(screen.getByText(`«${item.quote}»`)).toBeInTheDocument()
      expect(screen.getByText(item.family)).toBeInTheDocument()
    }
  })

  describe('arrows', () => {
    it('moves forward one testimonial, counting the gap between them', () => {
      const { scrollBy, scrollTo } = setup({ scrollLeft: 0, gap: '20px' })
      next()
      expect(scrollBy).toHaveBeenCalledExactlyOnceWith({ left: ITEM_WIDTH + 20 })
      expect(scrollTo).not.toHaveBeenCalled()
    })

    it('moves back one testimonial', () => {
      const { scrollBy } = setup({ scrollLeft: 300 })
      previous()
      expect(scrollBy).toHaveBeenCalledExactlyOnceWith({ left: -ITEM_WIDTH })
    })

    it('wraps from the last to the first', () => {
      const { scrollTo, scrollBy } = setup({ scrollLeft: MAX_SCROLL })
      next()
      expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 0 })
      expect(scrollBy).not.toHaveBeenCalled()
    })

    it('wraps from the first to the last', () => {
      const { scrollTo, scrollBy } = setup({ scrollLeft: 0 })
      previous()
      expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: MAX_SCROLL })
      expect(scrollBy).not.toHaveBeenCalled()
    })
  })

  describe('autoplay', () => {
    it('advances on its own every 4.5 seconds', () => {
      vi.useFakeTimers()
      const { scrollBy } = setup()

      tick()
      expect(scrollBy).toHaveBeenCalledTimes(1)
      tick()
      expect(scrollBy).toHaveBeenCalledTimes(2)
    })

    it('pauses and resumes with the button', () => {
      vi.useFakeTimers()
      const { scrollBy } = setup()

      const toggle = screen.getByRole('button', { name: 'Pausar' })
      expect(toggle).toHaveAttribute('aria-pressed', 'false')

      fireEvent.click(toggle)
      expect(toggle).toHaveTextContent('Reanudar')
      expect(toggle).toHaveAttribute('aria-pressed', 'true')
      tick()
      expect(scrollBy).not.toHaveBeenCalled()

      fireEvent.click(toggle)
      expect(toggle).toHaveTextContent('Pausar')
      tick()
      expect(scrollBy).toHaveBeenCalledTimes(1)
    })

    it('holds while the pointer is over it', () => {
      vi.useFakeTimers()
      const { region, scrollBy } = setup()

      fireEvent.mouseEnter(region)
      tick()
      expect(scrollBy).not.toHaveBeenCalled()

      fireEvent.mouseLeave(region)
      tick()
      expect(scrollBy).toHaveBeenCalledTimes(1)
    })

    it('holds while focus is inside', () => {
      vi.useFakeTimers()
      const { track, scrollBy } = setup()

      fireEvent.focus(track)
      tick()
      expect(scrollBy).not.toHaveBeenCalled()

      fireEvent.blur(track)
      tick()
      expect(scrollBy).toHaveBeenCalledTimes(1)
    })

    it('stops advancing once unmounted', () => {
      vi.useFakeTimers()
      const { unmount, scrollBy } = setup()
      unmount()
      tick()
      expect(scrollBy).not.toHaveBeenCalled()
    })

    it('starts paused when the visitor prefers reduced motion', () => {
      vi.useFakeTimers()
      vi.mocked(window.matchMedia).mockReturnValueOnce({ matches: true } as MediaQueryList)
      const { scrollBy } = setup()

      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
      expect(screen.getByRole('button', { name: 'Reanudar' })).toBeInTheDocument()
      tick()
      expect(scrollBy).not.toHaveBeenCalled()
    })
  })
})

describe('Testimonials with no content', () => {
  afterEach(() => {
    vi.doUnmock('../data/site.ts')
    vi.resetModules()
  })

  it('does not try to scroll when there are no testimonials', async () => {
    vi.resetModules()
    vi.doMock('../data/site.ts', () => ({ testimonials: [] }))
    const { Testimonials: EmptyTestimonials } = await import('./Testimonials.tsx')

    render(<EmptyTestimonials />)
    const track = screen.getByRole('list')
    const scrollTo = vi.fn()
    const scrollBy = vi.fn()
    Object.defineProperties(track, { scrollTo: { value: scrollTo }, scrollBy: { value: scrollBy } })

    next()
    expect(scrollTo).not.toHaveBeenCalled()
    expect(scrollBy).not.toHaveBeenCalled()
  })
})
