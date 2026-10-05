import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { HairStyle } from '../data/site.ts'
import { Avatar } from './Avatar.tsx'

const base = { skin: '#d9a074', hair: '#2b1b14', shirt: '#f8f6f1' }

function renderAvatar(props: Partial<Parameters<typeof Avatar>[0]> & { hairStyle: HairStyle }) {
  const { container } = render(<Avatar {...base} {...props} />)
  return container.querySelector('svg') as SVGSVGElement
}

// The two hair groups are the only ones filled with the hair colour.
function hairShapes(svg: SVGSVGElement) {
  const [back, front] = svg.querySelectorAll(`g[fill="${base.hair}"]`)
  return { back: back.children, front: front.children }
}

describe('Avatar', () => {
  it.each<[HairStyle, string | null, string, number]>([
    ['long', 'rect', 'path', 1],
    ['bob', 'rect', 'path', 1],
    ['bun', 'circle', 'path', 1],
    ['short', null, 'path', 1],
    ['buzz', null, 'path', 1],
    ['curly', null, 'circle', 7],
  ])('draws the %s hairstyle', (hairStyle, backTag, frontTag, frontCount) => {
    const { back, front } = hairShapes(renderAvatar({ hairStyle }))
    expect(back[0]?.tagName ?? null).toBe(backTag)
    expect(front).toHaveLength(frontCount)
    expect(front[0].tagName).toBe(frontTag)
  })

  it('tells long hair from a bob by its height', () => {
    const long = hairShapes(renderAvatar({ hairStyle: 'long' })).back[0]
    const bob = hairShapes(renderAvatar({ hairStyle: 'bob' })).back[0]
    expect(Number(long.getAttribute('height'))).toBeGreaterThan(Number(bob.getAttribute('height')))
  })

  it('draws no accessories unless asked', () => {
    const svg = renderAvatar({ hairStyle: 'short' })
    expect(svg.querySelector('g[stroke]')).not.toBeInTheDocument()
    expect(svg.querySelector('g[fill="#f5b82e"]')).not.toBeInTheDocument()
    expect(svg.querySelectorAll(`path[fill="${base.hair}"]`)).toHaveLength(0)
  })

  it('draws glasses, beard and earrings when asked', () => {
    const svg = renderAvatar({ hairStyle: 'short', glasses: true, beard: true, earrings: true })
    expect(svg.querySelectorAll('g[stroke] circle')).toHaveLength(2)
    expect(svg.querySelectorAll('g[fill="#f5b82e"] circle')).toHaveLength(2)
    expect(svg.querySelectorAll(`path[fill="${base.hair}"]`)).toHaveLength(1)
  })
})
