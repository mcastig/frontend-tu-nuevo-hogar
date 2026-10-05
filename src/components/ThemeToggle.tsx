import { useEffect, useState } from 'react'
import { applyTheme, readTheme, saveTheme } from '../theme.ts'

const sunIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    <path
      d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const moonIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor" />
  </svg>
)

export function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    saveTheme(next)
  }

  // The button shows and names the theme it switches to.
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      onClick={toggle}
    >
      {theme === 'dark' ? sunIcon : moonIcon}
    </button>
  )
}
