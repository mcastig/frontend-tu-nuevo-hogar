import { formatMillions, projects } from '../data/site.ts'
import { Facade } from './Facade.tsx'

// Twelve rays, one every 30 degrees.
const SUN_RAYS = Array.from({ length: 12 }, (_, index) => index * 30)

// Sun by day, moon and stars by night. Both are always rendered; the theme decides in CSS
// which one is up, so switching themes makes one set while the other rises.
const sky = (
  <div className="sky" aria-hidden="true">
    <div className="sky__body sky__sun">
      <div className="sky__rays">
        <svg viewBox="0 0 100 100" focusable="false">
          {SUN_RAYS.map((angle) => (
            <line key={angle} x1="50" y1="5" x2="50" y2="17" transform={`rotate(${angle} 50 50)`} />
          ))}
        </svg>
      </div>
      <div className="sky__disc" />
    </div>
    <div className="sky__body sky__moon">
      <span className="sky__star" />
      <span className="sky__star" />
      <span className="sky__star" />
      <span className="sky__star" />
      <div className="sky__crescent" />
    </div>
  </div>
)

export function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title">
            Aquí empieza <span>Tu Nuevo Hogar.</span>
          </h1>
          <p className="hero__lead">
            Casas nuevas en cuatro condominios de Huichapan, Hidalgo. Las pagas con Infonavit,
            Fovissste o crédito bancario, y te acompañamos desde la primera visita hasta las
            escrituras.
          </p>
          <div className="hero__actions">
            <a href="/proyectos" className="btn btn--indigo">
              Ver proyectos
            </a>
            <a href="/creditos" className="btn btn--outline">
              Simular mi crédito
            </a>
          </div>
        </div>

        <div className="street-scene">
          {sky}
          <ul className="street" aria-label="Nuestros condominios">
            {projects.map((project) => (
              <li key={project.id} className="street__lot">
                <a href={`/proyecto-${project.id}`} className="house">
                  <Facade variant={project.facade} colors={project.colors} />
                  <span className="house__plate">
                    <span className="house__name">{project.name}</span>
                    <span className="house__price">
                      desde {formatMillions(project.price)}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
