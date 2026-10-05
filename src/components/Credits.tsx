import { useState } from 'react'
import { projects, creditTypes, formatMXN, loanTerms } from '../data/site.ts'
import type { CreditId, Project, ProjectId } from '../data/site.ts'

const projectsById = Object.fromEntries(projects.map((p) => [p.id, p])) as Record<
  ProjectId,
  Project
>

// Common rule of thumb: the monthly payment should not exceed 30% of income.
const PAYMENT_TO_INCOME = 0.3

function monthlyPayment(principal: number, annualRate: number, years: number) {
  const months = years * 12
  const rate = annualRate / 100 / 12
  if (rate === 0) return principal / months
  return (principal * rate) / (1 - (1 + rate) ** -months)
}

function Simulator() {
  const [projectId, setProjectId] = useState<ProjectId>(projects[0].id)
  const [creditId, setCreditId] = useState<CreditId>(creditTypes[0].id)
  const [rate, setRate] = useState(String(creditTypes[0].referenceRate))
  const [downPct, setDownPct] = useState(10)
  const [years, setYears] = useState(20)

  const project = projectsById[projectId]
  const parsedRate = Number.parseFloat(rate)
  const rateIsValid = Number.isFinite(parsedRate) && parsedRate >= 0 && parsedRate <= 30

  const downPayment = Math.round((project.price * downPct) / 100)
  const principal = project.price - downPayment
  const payment = rateIsValid ? monthlyPayment(principal, parsedRate, years) : null

  return (
    <form className="sim on-dark" onSubmit={(e) => e.preventDefault()}>
      <h3 className="sim__title">Simula tu mensualidad</h3>

      <fieldset className="sim__group">
        <legend>Casa</legend>
        <div className="segmented segmented--wrap">
          {projects.map((p) => (
            <label key={p.id} className="segmented__item">
              <input
                type="radio"
                name="sim-project"
                value={p.id}
                checked={p.id === projectId}
                onChange={() => setProjectId(p.id)}
              />
              <span>
                {p.name}
                <small>{formatMXN(p.price)}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="sim__group">
        <legend>Crédito</legend>
        <div className="segmented segmented--wrap">
          {creditTypes.map((credit) => (
            <label key={credit.id} className="segmented__item">
              <input
                type="radio"
                name="sim-credit"
                value={credit.id}
                checked={credit.id === creditId}
                onChange={() => {
                  setCreditId(credit.id)
                  setRate(String(credit.referenceRate))
                }}
              />
              <span>{credit.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="sim__row">
        <fieldset className="sim__group">
          <legend>Plazo</legend>
          <div className="segmented">
            {loanTerms.map((term) => (
              <label key={term} className="segmented__item">
                <input
                  type="radio"
                  name="sim-years"
                  value={term}
                  checked={term === years}
                  onChange={() => setYears(term)}
                />
                <span>{term} años</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sim__group">
          <label htmlFor="sim-rate">Tasa anual (%)</label>
          <input
            id="sim-rate"
            className="sim__input"
            type="number"
            inputMode="decimal"
            min="0"
            max="30"
            step="0.1"
            value={rate}
            aria-invalid={!rateIsValid}
            aria-describedby="sim-rate-help"
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
      </div>

      <div className="sim__group">
        <label htmlFor="sim-down">
          Enganche: {downPct} % <span className="sim__aside">{formatMXN(downPayment)}</span>
        </label>
        <input
          id="sim-down"
          className="sim__range"
          type="range"
          min="5"
          max="50"
          step="5"
          value={downPct}
          onChange={(e) => setDownPct(Number(e.target.value))}
        />
      </div>

      <output className="sim__result" aria-live="polite">
        {payment === null ? (
          <p id="sim-rate-help" className="sim__error">
            Escribe una tasa anual entre 0 y 30 %.
          </p>
        ) : (
          <>
            <p className="sim__payment">
              <span>Mensualidad estimada</span>
              <strong>{formatMXN(Math.round(payment))}</strong>
            </p>
            <dl className="sim__breakdown">
              <div>
                <dt>Monto del crédito</dt>
                <dd>{formatMXN(principal)}</dd>
              </div>
              <div>
                <dt>Ingreso mensual sugerido</dt>
                <dd>{formatMXN(Math.round(payment / PAYMENT_TO_INCOME))}</dd>
              </div>
            </dl>
          </>
        )}
      </output>

      <p className="sim__disclaimer">
        Cálculo ilustrativo con tasa fija. No incluye seguros, comisiones ni gastos de
        escrituración, y no es una oferta de crédito. La tasa precargada es una referencia:
        cámbiala por la que te ofrezcan.
      </p>
    </form>
  )
}

export function Credits() {
  return (
    <section id="creditos" className="section">
      <div className="wrap">
        <header className="section__head">
          <p className="section__label">Créditos</p>
          <h2 className="section__title">Elige cómo pagarla</h2>
          <p className="section__lead">
            Aceptamos estos cuatro esquemas y también pago de contado. Si no sabes cuál te toca,
            trae tu número de seguridad social y lo revisamos en diez minutos.
          </p>
        </header>

        <div className="credits">
          <dl className="credit-list">
            {creditTypes.map((credit) => (
              <div key={credit.id} className="credit">
                <dt>
                  <span className="credit__name">{credit.name}</span>
                  <span className="credit__for">{credit.forWhom}</span>
                </dt>
                <dd>{credit.detail}</dd>
              </div>
            ))}
          </dl>

          <Simulator />
        </div>
      </div>
    </section>
  )
}
