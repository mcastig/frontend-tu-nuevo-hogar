/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// jsdom does not apply stylesheets, so these tests check the CSS as text: they catch a renamed
// variable or class that one side still uses and the other no longer defines.
// The files are read from disk because Vitest replaces CSS imports with empty modules.
const read = (file: string) => readFileSync(new URL(file, import.meta.url), 'utf8')
const baseCss = read('./index.css')
const appCss = read('./App.css')

const css = `${baseCss}\n${appCss}`.replace(/\/\*[\s\S]*?\*\//g, '')
const components = Object.values(
  import.meta.glob('./**/*.tsx', { query: '?raw', import: 'default', eager: true }),
)
  .filter((source): source is string => typeof source === 'string')
  .join('\n')

// A declaration such as `--ink: …`; the lookbehind skips class names like `.btn--outline:hover`.
const DEFINITION = /(?<![\w-])(--[\w-]+)\s*:/g

const unique = (values: Iterable<string>) => [...new Set(values)].sort()
const matches = (source: string, pattern: RegExp) =>
  unique([...source.matchAll(pattern)].map((match) => match[1]))

function ruleBody(selector: string) {
  const start = css.indexOf(`${selector} {`)
  expect(start, `rule "${selector}" exists`).toBeGreaterThan(-1)
  return css.slice(start, css.indexOf('}', start))
}

describe('custom properties', () => {
  it('defines every variable the stylesheets and components read', () => {
    const defined = new Set([
      ...matches(css, DEFINITION),
      ...matches(components, /'(--[\w-]+)'\s*:/g),
    ])
    const used = [...matches(css, /var\((--[\w-]+)/g), ...matches(components, /var\((--[\w-]+)/g)]

    expect(used.filter((name) => !defined.has(name))).toEqual([])
  })

  it('reads every variable it defines', () => {
    const defined = matches(css, DEFINITION)
    const used = new Set(matches(`${css}\n${components}`, /var\((--[\w-]+)/g))

    expect(defined.filter((name) => !used.has(name))).toEqual([])
  })
})

describe('themes', () => {
  const light = ruleBody(':root')
  const dark = ruleBody(":root[data-theme='dark']")
  const themeRoles = matches(light, /(--theme-[\w-]+)\s*:/g)

  it('gives the dark theme a value for every theme role', () => {
    expect(themeRoles.length).toBeGreaterThan(0)
    expect(matches(dark, /(--theme-[\w-]+)\s*:/g)).toEqual(themeRoles)
  })

  it('only overrides variables the light theme already defines', () => {
    const lightNames = new Set(matches(light, DEFINITION))
    expect(matches(dark, DEFINITION).filter((name) => !lightNames.has(name))).toEqual([])
  })

  it('tells the browser which colour scheme each theme uses', () => {
    expect(light).toMatch(/color-scheme:\s*light/)
    expect(dark).toMatch(/color-scheme:\s*dark/)
  })

  it('lets panels inside coloured sections return to every short role the sections change', () => {
    const roles = (selector: string) => matches(ruleBody(selector), DEFINITION)
    const reset = roles('.form,\n.confirm')

    expect(reset).toEqual(roles('.on-dark'))
    expect(reset).toEqual(roles('.section--yellow,\n.ticket'))
  })
})

describe('class names', () => {
  // Classes built at runtime from data, e.g. `chip--${status}`.
  const dynamicPrefixes = ['chip--', 'member__door--']
  const styled = matches(css, /\.(-?[a-zA-Z_][\w-]*)/g)

  it('styles no class that the components never use', () => {
    const unused = styled.filter(
      (name) =>
        !dynamicPrefixes.some((prefix) => name.startsWith(prefix)) &&
        !new RegExp(`[\\s"'\`]${name}[\\s"'\`]`).test(components),
    )
    expect(unused).toEqual([])
  })

  it('has a rule for each status chip and each team doorway colour in the data', async () => {
    const { projects, team } = await import('./data/site.ts')
    const needed = unique([
      ...projects.map((project) => `chip--${project.status}`),
      ...team.map((member) => `member__door--${member.color}`),
    ])

    expect(needed.filter((name) => !styled.includes(name))).toEqual([])
  })
})

describe('motion', () => {
  it('stops the endless hero animations for visitors who prefer reduced motion', () => {
    const start = appCss.lastIndexOf('@media (prefers-reduced-motion: reduce)', appCss.indexOf('.street__lot {'))
    const block = appCss.slice(start, appCss.indexOf('.street__lot {'))

    for (const name of ['.sky__rays', '.sky__disc', '.sky__crescent', '.sky__star']) {
      expect(block).toContain(name)
    }
    expect(block).toMatch(/animation:\s*none/)
  })

  it('shows the sun by default and swaps it for the moon in the dark theme', () => {
    expect(css).toMatch(/\.sky__moon,\s*:root\[data-theme='dark'\] \.sky__sun \{[^}]*opacity:\s*0/)
    expect(css).toMatch(/:root\[data-theme='dark'\] \.sky__moon \{[^}]*opacity:\s*1/)
  })
})
