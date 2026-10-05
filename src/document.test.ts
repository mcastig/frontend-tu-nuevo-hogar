import { afterEach, describe, expect, it, vi } from 'vitest'
import html from '../index.html?raw'
import { readTheme } from './theme.ts'

const page = new DOMParser().parseFromString(html, 'text/html')

// The inline script that sets the theme before first paint.
const inlineScript = [...page.querySelectorAll('script')].find((script) => !script.src)
const runInlineScript = new Function(inlineScript?.textContent ?? '')

afterEach(() => {
  vi.restoreAllMocks()
  vi.mocked(window.matchMedia).mockReset()
})

describe('index.html', () => {
  it('declares the page language, mount point and entry module', () => {
    expect(page.documentElement.lang).toBe('es-MX')
    expect(page.getElementById('root')).not.toBeNull()
    expect(page.querySelector('script[type="module"]')?.getAttribute('src')).toBe('/src/main.tsx')
  })

  it('has a title, a description and the light browser bar colour', () => {
    expect(page.title).toContain('Tu Nuevo Hogar')
    expect(page.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(
      'Cuatro condominios',
    )
    expect(page.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#cfe3f1')
    expect(page.querySelector('meta[name="viewport"]')).not.toBeNull()
  })

  it('loads fonts only from Google Fonts, preconnecting first', () => {
    const preconnects = [...page.querySelectorAll('link[rel="preconnect"]')].map((link) =>
      link.getAttribute('href'),
    )
    expect(preconnects).toEqual(['https://fonts.googleapis.com', 'https://fonts.gstatic.com'])

    const stylesheets = [...page.querySelectorAll('link[rel="stylesheet"]')]
    expect(stylesheets).toHaveLength(1)
    expect(stylesheets[0].getAttribute('href')).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?/)
  })

  it('loads no third-party scripts', () => {
    const external = [...page.querySelectorAll('script[src]')]
      .map((script) => script.getAttribute('src'))
      .filter((src) => src?.startsWith('http'))
    expect(external).toEqual([])
  })
})

describe('pre-paint theme script', () => {
  it('runs before the stylesheet and the app so the first paint is already themed', () => {
    const head = [...page.head.children]
    const scriptAt = head.indexOf(inlineScript as HTMLScriptElement)

    expect(scriptAt).toBeGreaterThan(-1)
    expect(scriptAt).toBeLessThan(head.findIndex((node) => node.matches('link[rel="stylesheet"]')))
  })

  // Every combination must match readTheme(), which the toggle uses once the app loads.
  it.each([
    { saved: null, systemDark: false, expected: 'light' },
    { saved: null, systemDark: true, expected: 'dark' },
    { saved: 'light', systemDark: true, expected: 'light' },
    { saved: 'dark', systemDark: false, expected: 'dark' },
    { saved: 'blue', systemDark: false, expected: 'light' },
    { saved: 'blue', systemDark: true, expected: 'dark' },
  ])(
    'picks $expected when saved is $saved and system dark is $systemDark, like the app does',
    ({ saved, systemDark, expected }) => {
      if (saved) window.localStorage.setItem('theme', saved)
      vi.mocked(window.matchMedia).mockReturnValue({ matches: systemDark } as MediaQueryList)

      runInlineScript()

      expect(document.documentElement.dataset.theme).toBe(expected)
      expect(readTheme()).toBe(expected)
    },
  )

  it('follows the system setting when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList)

    expect(runInlineScript).not.toThrow()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(readTheme()).toBe('dark')
  })
})
