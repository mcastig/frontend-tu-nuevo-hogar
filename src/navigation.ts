// Sections are addressed by path (/proyectos) instead of by hash (#proyectos), so the address bar
// stays clean and every section still has a link that can be shared. The host must serve
// index.html for those paths; see vercel.json.

// The section a path points at: "/" is the top of the page, "/creditos" the element with that id.
function targetOf(pathname: string) {
  const id = pathname.replace(/^\/+|\/+$/g, '')
  return id === '' ? document.documentElement : document.getElementById(id)
}

function reveal(target: HTMLElement, behavior: ScrollBehavior) {
  if (target === document.documentElement) window.scrollTo({ top: 0, behavior })
  else target.scrollIntoView({ behavior })

  // Move keyboard focus along with the view, as following a hash link would.
  target.tabIndex = -1
  target.focus({ preventScroll: true })
}

function isPlainLeftClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

// Starts handling section links, the back and forward buttons and the address the page was
// opened with. Returns a function that stops it.
export function startSectionNavigation() {
  // Links shared before this change used a hash; send them to the same section.
  const legacyId = window.location.hash.slice(1)
  if (legacyId && document.getElementById(legacyId)) {
    window.history.replaceState(null, '', `/${legacyId}`)
  }

  const opened = targetOf(window.location.pathname)
  if (opened && opened !== document.documentElement) reveal(opened, 'instant')

  function handleClick(event: MouseEvent) {
    const link = (event.target as Element).closest('a')
    if (!link || link.target === '_blank' || link.origin !== window.location.origin) return
    if (event.defaultPrevented || !isPlainLeftClick(event)) return

    const target = targetOf(link.pathname)
    if (!target) return

    event.preventDefault()
    if (link.pathname !== window.location.pathname) {
      window.history.pushState(null, '', link.pathname)
    }
    reveal(target, 'auto')
  }

  function handlePopState() {
    const target = targetOf(window.location.pathname)
    if (target) reveal(target, 'auto')
  }

  document.addEventListener('click', handleClick)
  window.addEventListener('popstate', handlePopState)
  return () => {
    document.removeEventListener('click', handleClick)
    window.removeEventListener('popstate', handlePopState)
  }
}
