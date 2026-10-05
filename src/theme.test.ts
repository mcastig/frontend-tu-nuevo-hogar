import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, readTheme, saveTheme } from './theme.ts'

const systemPrefersDark = () =>
  vi.mocked(window.matchMedia).mockReturnValueOnce({ matches: true } as MediaQueryList)

const blockStorage = () => {
  const blocked = () => {
    throw new Error('storage blocked')
  }
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked)
}

afterEach(() => {
  vi.restoreAllMocks()
  // Drops any queued "prefers dark" answer a test did not consume.
  vi.mocked(window.matchMedia).mockReset()
  document.head.innerHTML = ''
})

describe('readTheme', () => {
  it('follows the system setting when nothing is saved', () => {
    expect(readTheme()).toBe('light')

    systemPrefersDark()
    expect(readTheme()).toBe('dark')
    expect(window.matchMedia).toHaveBeenLastCalledWith('(prefers-color-scheme: dark)')
  })

  it('prefers the saved choice over the system setting', () => {
    window.localStorage.setItem('theme', 'dark')
    expect(readTheme()).toBe('dark')

    window.localStorage.setItem('theme', 'light')
    systemPrefersDark()
    expect(readTheme()).toBe('light')
  })

  it('ignores a saved value that is not a theme', () => {
    window.localStorage.setItem('theme', 'blue')
    expect(readTheme()).toBe('light')
  })

  it('falls back to the system setting when storage is blocked', () => {
    blockStorage()
    systemPrefersDark()
    expect(readTheme()).toBe('dark')
  })
})

describe('saveTheme', () => {
  it('saves the choice', () => {
    saveTheme('dark')
    expect(window.localStorage.getItem('theme')).toBe('dark')
  })

  it('does not throw when storage is blocked', () => {
    blockStorage()
    expect(() => saveTheme('dark')).not.toThrow()
  })
})

describe('applyTheme', () => {
  it('sets the theme on the document element', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')

    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('updates the browser bar colour when the meta tag exists', () => {
    document.head.innerHTML = '<meta name="theme-color" content="#cfe3f1" />'
    const meta = document.querySelector('meta[name="theme-color"]')

    applyTheme('dark')
    expect(meta).toHaveAttribute('content', '#173a5e')

    applyTheme('light')
    expect(meta).toHaveAttribute('content', '#cfe3f1')
  })
})
