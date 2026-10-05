export type Theme = 'light' | 'dark'

// index.html runs the same lookup inline before first paint; keep the two in sync.
const STORAGE_KEY = 'theme'
const BROWSER_BAR_COLOR: Record<Theme, string> = { light: '#cfe3f1', dark: '#173a5e' }

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

// Storage can be unavailable (private mode, blocked site data); the theme then lasts one visit.
function readSavedTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

// The visitor's saved choice wins; otherwise follow the system setting.
export function readTheme(): Theme {
  const saved = readSavedTheme()
  if (isTheme(saved)) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Nothing to do: the theme still applies for this visit.
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', BROWSER_BAR_COLOR[theme])
}
