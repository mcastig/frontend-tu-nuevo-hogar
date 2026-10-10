import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { startSectionNavigation } from './navigation.ts'

let stop: () => void = () => {}

function start() {
  stop = startSectionNavigation()
}

function click(selector: string, init: MouseEventInit = {}) {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init })
  document.querySelector(selector)?.dispatchEvent(event)
  return event
}

const section = (id: string) => document.getElementById(id) as HTMLElement

beforeEach(() => {
  document.body.innerHTML = `
    <a id="home" href="/">Inicio</a>
    <a id="to-credits" href="/creditos"><span id="inside-link">Créditos</span></a>
    <a id="to-contact" href="/contacto/">Contacto</a>
    <a id="to-missing" href="/no-existe">Otra página</a>
    <a id="external" href="https://wa.me/527121006312">WhatsApp</a>
    <a id="new-tab" href="/creditos" target="_blank">Créditos en otra pestaña</a>
    <button id="not-a-link">Botón</button>
    <section id="creditos"></section>
    <section id="contacto"></section>
  `
  vi.mocked(window.scrollTo).mockClear()
  vi.mocked(Element.prototype.scrollIntoView).mockClear()
})

afterEach(() => {
  stop()
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('tabindex')
  vi.restoreAllMocks()
})

describe('section links', () => {
  it('scrolls to the section and shows its path without a hash', () => {
    start()
    const event = click('#to-credits')

    expect(event.defaultPrevented).toBe(true)
    expect(window.location.pathname).toBe('/creditos')
    expect(window.location.hash).toBe('')
    expect(section('creditos').scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: 'auto' })
  })

  it('moves keyboard focus to the section', () => {
    start()
    click('#to-credits')

    expect(section('creditos')).toHaveFocus()
    expect(section('creditos')).toHaveAttribute('tabindex', '-1')
  })

  it('works when the click lands on an element inside the link', () => {
    start()
    click('#inside-link')
    expect(window.location.pathname).toBe('/creditos')
  })

  it('accepts a trailing slash in the link', () => {
    start()
    click('#to-contact')
    expect(section('contacto')).toHaveFocus()
  })

  it('adds one history entry per section, and none when the section is already current', () => {
    const pushState = vi.spyOn(window.history, 'pushState')
    start()

    click('#to-credits')
    click('#to-credits')
    expect(pushState).toHaveBeenCalledTimes(1)
    expect(section('creditos').scrollIntoView).toHaveBeenCalledTimes(2)
  })

  it('returns to the top of the page from the home link', () => {
    start()
    click('#to-credits')
    click('#home')

    expect(window.location.pathname).toBe('/')
    expect(window.scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 0, behavior: 'auto' })
    expect(section('creditos')).not.toHaveFocus()
    expect(document.documentElement).toHaveFocus()
  })
})

describe('clicks it leaves alone', () => {
  it.each([
    ['a link to a path with no section', '#to-missing'],
    ['an external link', '#external'],
    ['a link that opens in a new tab', '#new-tab'],
    ['something that is not a link', '#not-a-link'],
  ])('ignores %s', (_, selector) => {
    start()
    const event = click(selector)

    expect(event.defaultPrevented).toBe(false)
    expect(window.location.pathname).toBe('/')
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
  })

  it.each([
    ['Cmd', { metaKey: true }],
    ['Ctrl', { ctrlKey: true }],
    ['Shift', { shiftKey: true }],
    ['Alt', { altKey: true }],
    ['the middle button', { button: 1 }],
  ])('lets the browser handle a click with %s', (_, init) => {
    start()
    const event = click('#to-credits', init)

    expect(event.defaultPrevented).toBe(false)
    expect(window.location.pathname).toBe('/')
  })

  it('ignores a click another handler already cancelled', () => {
    start()
    document.querySelector('#to-credits')?.addEventListener('click', (e) => e.preventDefault())
    click('#to-credits')

    expect(window.location.pathname).toBe('/')
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
  })
})

describe('opening the page', () => {
  it('stays at the top for the home path', () => {
    start()
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('jumps straight to the section named in the path', () => {
    window.history.replaceState(null, '', '/contacto')
    start()
    expect(section('contacto').scrollIntoView).toHaveBeenCalledExactlyOnceWith({
      behavior: 'instant',
    })
  })

  it('stays at the top for a path with no section', () => {
    window.history.replaceState(null, '', '/no-existe')
    start()
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
  })

  it('turns an old hash link into its clean path', () => {
    window.history.replaceState(null, '', '/#creditos')
    start()

    expect(window.location.pathname).toBe('/creditos')
    expect(window.location.hash).toBe('')
    expect(section('creditos').scrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('leaves a hash that names no section untouched', () => {
    window.history.replaceState(null, '', '/#otra-cosa')
    start()

    expect(window.location.hash).toBe('#otra-cosa')
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
  })
})

describe('back and forward buttons', () => {
  it('scrolls to the section of the address the browser returned to', () => {
    start()
    window.history.replaceState(null, '', '/contacto')
    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(section('contacto').scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: 'auto' })
  })

  it('returns to the top when the browser goes back to the home path', () => {
    start()
    click('#to-credits')
    window.history.replaceState(null, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(window.scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 0, behavior: 'auto' })
  })

  it('does nothing for an address with no section', () => {
    start()
    window.history.replaceState(null, '', '/no-existe')
    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})

describe('stopping', () => {
  it('stops handling clicks and history once stopped', () => {
    start()
    stop()

    const event = click('#to-credits')
    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(event.defaultPrevented).toBe(false)
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
  })
})
