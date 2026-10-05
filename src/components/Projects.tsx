import { formatMXN, projects } from '../data/site.ts'
import type { ProjectId } from '../data/site.ts'
import { Facade } from './Facade.tsx'

type ProjectsProps = {
  onAskAbout: (id: ProjectId) => void
}

export function Projects({ onAskAbout }: ProjectsProps) {
  return (
    <section id="proyectos" className="section">
      <div className="wrap">
        <header className="section__head">
          <p className="section__label">Proyectos</p>
          <h2 className="section__title">Cuatro condominios, cada uno con su color</h2>
          <p className="section__lead">
            Tulipán, Bugambilia, Jacaranda y Cempasúchil comparten avenida, escuela y mercado.
            Cambian el tamaño de la casa y el precio.
          </p>
        </header>

        <div className="projects">
          {projects.map((project) => (
            <article key={project.id} id={`proyecto-${project.id}`} className="project">
              <div className="project__picture">
                <Facade variant={project.facade} colors={project.colors} />
                <span className={`chip chip--${project.status}`}>{project.statusLabel}</span>
              </div>

              <div className="project__body">
                <h3 className="project__name">{project.name}</h3>
                <p className="project__summary">{project.summary}</p>

                <p className="project__price">
                  <span>Desde</span>
                  <strong>{formatMXN(project.price)}</strong>
                </p>

                <dl className="specs">
                  <div>
                    <dt>Casa</dt>
                    <dd>
                      {project.bedrooms}, {project.bathrooms}
                    </dd>
                  </div>
                  <div>
                    <dt>Construcción</dt>
                    <dd>{project.builtArea} m²</dd>
                  </div>
                  <div>
                    <dt>Terreno</dt>
                    <dd>{project.lotArea} m²</dd>
                  </div>
                  <div>
                    <dt>Estacionamiento</dt>
                    <dd>{project.parking}</dd>
                  </div>
                  <div>
                    <dt>Entrega</dt>
                    <dd>{project.delivery}</dd>
                  </div>
                </dl>

                <ul className="project__amenities">
                  {project.amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>

                <a
                  href="#contacto"
                  className="btn btn--indigo project__cta"
                  onClick={() => onAskAbout(project.id)}
                >
                  Agendar visita a {project.name}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
