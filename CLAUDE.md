# Tu Nuevo Hogar frontend

Single-page landing site for a fictional Mexican home builder. React 19 + TypeScript + Vite, plain
CSS, no backend. See `README.md` for the feature overview and file layout.

## Commands

```bash
npm run dev        # dev server
npm run build      # tsc -b && vite build (type-checks tests too)
npm run lint       # eslint
npm test           # vitest run
npm run coverage   # vitest with coverage; fails under 100% on any measure
```

Run `npm run coverage`, `npm run build` and `npm run lint` before calling a change done. All three
must pass.

## Conventions

- **Code in English, copy in Spanish.** Identifiers, CSS class and variable names, internal data
  values, comments and test titles are English. Anything a visitor reads stays in Mexican Spanish.
  Section ids and paths (`/proyectos`, `/contacto`…) are Spanish on purpose: they show in the URL.
- **Content lives in `src/data/site.ts`.** Add or change houses, promotions, team members, FAQs,
  contact details and the WhatsApp number there, not in components.
- **No image assets.** Houses come from `Facade.tsx` and portraits from `Avatar.tsx`, driven by
  data. Do not add stock photos or placeholder image URLs.
- **No new runtime dependencies** without asking. The site ships only React.
- Import modules directly with their extension (`./Hero.tsx`); there are no barrel files.
- Use `import type` for types (`verbatimModuleSyntax` is on) and no enums (`erasableSyntaxOnly`).
- Match the existing comment density: short comments that explain why, none that restate the code.

## Styling

- All styles are in `src/index.css` (palette, theme roles, base, buttons, section backgrounds) and
  `src/App.css` (components, grouped under section comments). Class names are BEM-like:
  `block__element--modifier`.
- **Use theme roles, not raw palette colours, for anything that should change with the theme:**
  `--page`, `--surface`, `--ink`, `--on-ink`, `--muted`, `--line`, `--rule`, `--danger`. Their
  values come from `--theme-*` variables, which `:root[data-theme='dark']` overrides.
- Sections with a fixed background re-declare the short roles locally (`.on-dark`,
  `.section--yellow`, `.ticket`). Panels inside them that should follow the page theme reset the
  roles from `--theme-*` (`.form`, `.confirm`). When adding a role, add it to all three groups;
  `src/styles.test.ts` fails otherwise.
- Palette variables (`--indigo`, `--pink`, `--yellow`…) are for surfaces that keep their colour in
  both themes.
- Every looping animation needs an `animation: none` rule under
  `@media (prefers-reduced-motion: reduce)`. The global reduced-motion rule only shortens durations.
- There is no shared breakpoint scale; each component breaks where its own content needs it
  (values range from 30rem to 72rem). The two that several rules share are 60rem, where the navbar
  collapses, and 40rem, for phone layouts. Reuse the nearest existing value before adding one.

## Testing

- Tests sit next to the code as `*.test.ts(x)`; `src/components/static.test.tsx` groups the
  display-only components.
- Coverage thresholds are 100%. New code needs tests in the same change. Prefer removing an
  unreachable branch over adding a coverage-ignore comment.
- Query by role and visible Spanish text, as a visitor would.
- jsdom gaps are filled in `src/test/setup.ts`: `matchMedia` is a `vi.fn` returning
  `matches: false`, and `<dialog>` `showModal`/`close` are stubbed. Override `matchMedia` per test
  with `mockReturnValueOnce`, and call `mockReset()` if a queued value may go unused.
- **Vitest replaces CSS imports with empty modules**, including `?raw`. `src/styles.test.ts` reads
  the stylesheets from disk with `node:fs` for that reason.
- jsdom does not apply CSS or lay anything out. Verify visual changes in a real browser at desktop
  and phone widths, in both themes.
- The OpenStreetMap embed needs WebGL, so it renders an error message in headless Chrome started
  with `--disable-gpu`. That is an artifact of the test browser, not a bug.

## Things that are deliberate

- **Section links are paths, not hashes.** Write `href="/contacto"`, never `href="#contacto"`; the
  path is the id of the element to scroll to, and `/` is the top. `src/navigation.ts` handles the
  click, history and direct loads, and `vercel.json` makes the host serve `index.html` for those
  paths. Tests fail on any in-page link with a hash or without a matching element.

- **The contact form sends nothing.** It validates, shows a review dialog, then clears itself. Keep
  it that way unless asked to wire a backend; when that happens, send the output of `clean()` plus
  `interest` and `channel`, never the raw field values.
- **`localStorage` holds only the theme** (`theme` = `light` | `dark`), written when the visitor
  uses the toggle. Do not store form data.
- The inline script in `index.html` duplicates the lookup in `src/theme.ts` so the page never
  flashes the wrong theme. Change both together; `src/document.test.ts` compares them.
- The floating WhatsApp button is `position: fixed` and rendered after the footer. The footer's
  large bottom padding exists to keep that button off the last menu links.
- The FAQ is linked from the footer only; a sixth navbar item does not fit at laptop widths.
- The map iframe is sandboxed (`allow-scripts allow-same-origin allow-popups`). Keep it sandboxed.
- External links use `target="_blank"` with `rel="noreferrer"`; a test enforces this.

## Demo content

Everything in `src/data/site.ts` is invented: names, prices, the Huichapan address, phone numbers,
testimonials and the privacy notice (a draft, not legal text). The WhatsApp number is a test bot
number supplied by the project owner. Do not present any of it as real, and keep new sample content
consistent with what is already there (for example, no testimonials from a house still in presale).

## Related

- `backend-tu-nuevo-hogar` (sibling directory) is the backend project. It is not connected to this
  frontend yet.
- A third-party agent skill, `security-auditor`, is installed under `.agents/skills/` and pinned in
  `skills-lock.json`.
