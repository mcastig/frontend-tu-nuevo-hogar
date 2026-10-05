import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
  window.history.replaceState(null, '', '/')
})

// Browser APIs that jsdom does not implement.
window.matchMedia = vi.fn((query: string) => ({ matches: false, media: query })) as never

window.scrollTo = vi.fn() as never
Element.prototype.scrollIntoView = vi.fn()

HTMLDialogElement.prototype.showModal = function showModal() {
  this.open = true
}
HTMLDialogElement.prototype.close = function close() {
  this.open = false
}
