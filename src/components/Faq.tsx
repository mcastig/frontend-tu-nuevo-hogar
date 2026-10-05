import { faqs } from '../data/site.ts'

export function Faq() {
  return (
    <section id="preguntas" className="section">
      <div className="wrap faq">
        <header className="section__head">
          <p className="section__label">Dudas</p>
          <h2 className="section__title">Preguntas frecuentes</h2>
          <p className="section__lead">
            Si la tuya no está aquí, <a href="/contacto">agenda una visita</a> y la resolvemos en
            persona.
          </p>
        </header>

        <div className="faq__list">
          {faqs.map((item) => (
            <details key={item.question} className="faq__item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
