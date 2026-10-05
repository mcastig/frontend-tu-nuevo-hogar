import { useEffect, useRef, useState } from 'react'
import { testimonials } from '../data/site.ts'

const AUTOPLAY_MS = 4500
// Slack for deciding the carousel has reached either end.
const EDGE_TOLERANCE = 4

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Moves one testimonial forward or back; at either end it wraps to the other.
function step(track: HTMLElement | null, direction: 1 | -1) {
  const first = track?.firstElementChild
  if (!track || !(first instanceof HTMLElement)) return

  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
  const max = track.scrollWidth - track.clientWidth

  if (direction === 1 && track.scrollLeft >= max - EDGE_TOLERANCE) track.scrollTo({ left: 0 })
  else if (direction === -1 && track.scrollLeft <= EDGE_TOLERANCE) track.scrollTo({ left: max })
  else track.scrollBy({ left: direction * (first.offsetWidth + gap) })
}

export function Testimonials() {
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const trackRef = useRef<HTMLUListElement>(null)
  // While the visitor is reading (pointer or focus inside), autoplay holds.
  const engagedRef = useRef(false)

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      if (!engagedRef.current) step(trackRef.current, 1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [playing])

  return (
    <section className="section section--yellow" aria-labelledby="testimonios-titulo">
      <div
        className="wrap"
        onMouseEnter={() => (engagedRef.current = true)}
        onMouseLeave={() => (engagedRef.current = false)}
        onFocus={() => (engagedRef.current = true)}
        onBlur={() => (engagedRef.current = false)}
      >
        <header className="section__head quotes-head">
          <h2 id="testimonios-titulo" className="section__title">
            Ya viven aquí
          </h2>

          <div className="quotes-controls">
            <button
              type="button"
              className="btn btn--outline quotes-controls__play"
              aria-pressed={!playing}
              onClick={() => setPlaying((current) => !current)}
            >
              {playing ? 'Pausar' : 'Reanudar'}
            </button>
            <button
              type="button"
              className="btn btn--outline quotes-controls__arrow"
              aria-label="Testimonio anterior"
              onClick={() => step(trackRef.current, -1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="btn btn--outline quotes-controls__arrow"
              aria-label="Testimonio siguiente"
              onClick={() => step(trackRef.current, 1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </header>

        <ul
          ref={trackRef}
          className="quotes"
          tabIndex={0}
          aria-label={`${testimonials.length} testimonios de familias`}
        >
          {testimonials.map((item) => (
            <li key={item.family}>
              <figure className="quote">
                <blockquote>«{item.quote}»</blockquote>
                <figcaption>
                  <strong>{item.family}</strong>
                  <span>{item.project}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
