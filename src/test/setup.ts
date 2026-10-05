import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
})

// Browser APIs that jsdom does not implement.
window.matchMedia = vi.fn((query: string) => ({ matches: false, media: query })) as never

HTMLDialogElement.prototype.showModal = function showModal() {
  this.open = true
}
HTMLDialogElement.prototype.close = function close() {
  this.open = false
}
