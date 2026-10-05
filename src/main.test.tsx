import { screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

afterEach(() => {
  document.body.innerHTML = ''
})

it('mounts the app in #root', async () => {
  document.body.innerHTML = '<div id="root"></div>'
  await import('./main.tsx')

  expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
    'Aquí empieza Tu Nuevo Hogar.',
  )
  expect(document.getElementById('root')).not.toBeEmptyDOMElement()
})
