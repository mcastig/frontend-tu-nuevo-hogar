import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { creditTypes } from '../data/site.ts'
import { Credits } from './Credits.tsx'

function setup() {
  const view = render(<Credits />)
  const result = view.container.querySelector('output') as HTMLOutputElement
  const rate = screen.getByLabelText('Tasa anual (%)') as HTMLInputElement
  return { ...view, result: within(result), rate, user: userEvent.setup() }
}

describe('Credits', () => {
  it('explains each credit type', () => {
    setup()
    for (const credit of creditTypes) {
      expect(screen.getByText(credit.forWhom)).toBeInTheDocument()
      expect(screen.getByText(credit.detail)).toBeInTheDocument()
    }
  })

  it('computes the initial monthly payment: Tulipán, Infonavit, 20 years, 10% down', () => {
    const { result, rate } = setup()
    expect(rate).toHaveValue(8.5)
    expect(screen.getByText('Enganche: 10 %', { exact: false })).toHaveTextContent('$265,000')
    // 2,385,000 at 8.5% a year over 240 months
    expect(result.getByText('$20,698')).toBeInTheDocument()
    expect(result.getByText('$2,385,000')).toBeInTheDocument()
    expect(result.getByText('$68,992')).toBeInTheDocument()
  })

  it('recalculates when the house changes', async () => {
    const { result, user } = setup()
    await user.click(screen.getByRole('radio', { name: /Bugambilia/ }))
    expect(result.getByText('$11,559')).toBeInTheDocument()
    expect(result.getByText('$1,332,000')).toBeInTheDocument()
  })

  it('loads the reference rate when the credit type changes', async () => {
    const { rate, user } = setup()
    await user.click(screen.getByRole('radio', { name: 'Fovissste' }))
    expect(rate).toHaveValue(6)
    await user.click(screen.getByRole('radio', { name: 'Bancario' }))
    expect(rate).toHaveValue(11)
  })

  it('recalculates when the term and down payment change', async () => {
    const { result, user } = setup()
    await user.click(screen.getByRole('radio', { name: '30 años' }))
    expect(result.getByText('$18,339')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Enganche/), { target: { value: '20' } })
    expect(screen.getByText('Enganche: 20 %', { exact: false })).toHaveTextContent('$530,000')
    expect(result.getByText('$2,120,000')).toBeInTheDocument()
  })

  it('splits the loan into equal parts at a zero rate', () => {
    const { result, rate } = setup()
    fireEvent.change(rate, { target: { value: '0' } })
    // 2,385,000 / 240
    expect(result.getByText('$9,938')).toBeInTheDocument()
  })

  it.each(['', '-1', '31'])('asks for a valid rate when "%s" is typed', (value) => {
    const { result, rate } = setup()
    fireEvent.change(rate, { target: { value } })

    expect(result.getByText('Escribe una tasa anual entre 0 y 30 %.')).toBeInTheDocument()
    expect(rate).toHaveAttribute('aria-invalid', 'true')
    expect(result.queryByText('Mensualidad estimada')).not.toBeInTheDocument()
  })

  it('does not reload the page when the simulator is submitted', () => {
    const { container } = setup()
    const form = container.querySelector('form') as HTMLFormElement
    expect(fireEvent.submit(form)).toBe(false)
  })
})
