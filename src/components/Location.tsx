import { contact } from '../data/site.ts'

export function Location() {
  return (
    <section id="ubicacion" className="section">
      <div className="wrap">
        <header className="section__head location__head">
          <div>
            <p className="section__label">Ubicación</p>
            <h2 className="section__title">Cómo llegar</h2>
          </div>
          <div className="location__address">
            <p>
              <strong>Centro de ventas</strong>
              <br />
              {contact.address[0]}
              <br />
              {contact.address[1]}
            </p>
            <a
              href={contact.map.linkUrl}
              className="btn btn--outline"
              target="_blank"
              rel="noreferrer"
            >
              Abrir el mapa en otra pestaña
            </a>
          </div>
        </header>

        <iframe
          className="location__map"
          src={contact.map.embedUrl}
          title="Mapa de Huichapan, Hidalgo, con la ubicación del centro de ventas"
          loading="lazy"
          // The map needs scripts and its own origin; it cannot navigate or submit forms on this page.
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </section>
  )
}
