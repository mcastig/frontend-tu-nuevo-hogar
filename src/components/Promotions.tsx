import { promotions } from '../data/site.ts'

export function Promotions() {
  return (
    <section id="promociones" className="section section--pink on-dark">
      <div className="wrap">
        <header className="section__head">
          <p className="section__label">Promociones</p>
          <h2 className="section__title">Lo que hay este otoño</h2>
          <p className="section__lead">
            Cada promoción tiene fecha de cierre. Pregunta por ella al agendar tu visita.
          </p>
        </header>

        <ul className="tickets">
          {promotions.map((promo) => (
            <li key={promo.id} className="ticket">
              <div className="ticket__top">
                <p className="ticket__for">{promo.appliesTo}</p>
                <h3 className="ticket__title">{promo.title}</h3>
              </div>
              <div className="ticket__cut" aria-hidden="true" />
              <div className="ticket__bottom">
                <p>{promo.detail}</p>
                <p className="ticket__validity">{promo.validity}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="fineprint">
          Las promociones no son acumulables y aplican solo a las casas y fechas indicadas.
        </p>
      </div>
    </section>
  )
}
