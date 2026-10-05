# Tu Nuevo Hogar

Landing page for a fictional Mexican home builder. It presents four condominiums, their
promotions, credit options with a payment simulator, the sales team, a map, a contact form and a
FAQ. The page is in Spanish; the code is in English.

Demo: [Tu Nuevo Hogar](https://frontend-tu-nuevo-hogar.vercel.app/)


<img width="1490" height="669" alt="Captura de pantalla 2026-10-04 a la(s) 11 23 55 p m" src="https://github.com/user-attachments/assets/fed8f982-90e2-4319-ba02-c0a82307fa22" />

<img width="1487" height="780" alt="Captura de pantalla 2026-10-05 a la(s) 12 26 55 a m" src="https://github.com/user-attachments/assets/ecd31803-c755-48a6-b36d-fee741497421" />

**This is a demo.** All names, prices, addresses, testimonials and the privacy notice are invented,
and the contact form does not send or store anything.

## Getting started

Needs a Node.js version that Vite 8 supports (`^20.19.0 || >=22.12.0`). Developed on Node 24.

```bash
npm install
npm run dev
```

| Command              | What it does                                                     |
| -------------------- | ---------------------------------------------------------------- |
| `npm run dev`        | Starts the development server with hot reload                    |
| `npm run build`      | Type-checks and builds the site into `dist/`                     |
| `npm run preview`    | Serves the built site locally                                    |
| `npm run lint`       | Runs ESLint                                                      |
| `npm test`           | Runs the unit tests once                                         |
| `npm run test:watch` | Re-runs the tests as files change                                |
| `npm run coverage`   | Runs the tests with coverage; fails below 100% on any measure    |

## Stack

- React 19 and TypeScript, built with Vite
- Plain CSS with custom properties; no CSS framework or UI library
- Vitest, Testing Library and jsdom for tests
- No backend, no router and no runtime dependencies beyond React

## What is on the page

In page order, which is also the navbar order:

| Section      | Anchor          | Notes                                                                 |
| ------------ | --------------- | --------------------------------------------------------------------- |
| Hero         | `#inicio`       | Street of four illustrated houses; animated sun (light) or moon (dark) |
| Proyectos    | `#proyectos`    | One card per condominium: Tulipán, Bugambilia, Jacaranda, Cempasúchil |
| Promociones  | `#promociones`  | Four coupon-style promotions                                          |
| Créditos     | `#creditos`     | Credit types and a monthly payment simulator                          |
| Equipo       | `#equipo`       | Six team members with illustrated avatars                             |
| Testimonials | (no nav link)   | Ten quotes in an auto-advancing carousel                              |
| Ubicación    | `#ubicacion`    | OpenStreetMap embed                                                   |
| Contacto     | `#contacto`     | Validated form with a review step and privacy consent                 |
| FAQ          | `#preguntas`    | Eight questions in an accordion; linked from the footer only          |

Also: a light/dark theme toggle in the header and a floating WhatsApp button.

## Project structure

```
index.html              Page shell, font links, pre-paint theme script
src/
  main.tsx              Entry point
  App.tsx               Composes the sections; holds the "condominium of interest" state
  theme.ts              Theme lookup, persistence and application
  index.css             Palette, theme roles, base styles, buttons, section backgrounds
  App.css               Styles for every component, grouped by section
  data/site.ts          All page content and its types
  components/           One file per section, plus Facade, Avatar, Logo, ThemeToggle, dialogs
  test/setup.ts         Test setup and browser API stand-ins
  **/*.test.ts(x)       Tests, next to the code they cover
```

## Editing content

Almost everything a visitor reads lives in [`src/data/site.ts`](src/data/site.ts):

- `projects`: the four houses. Their order here is their order on the hero street, the cards, the
  simulator and the contact form.
- `promotions`, `creditTypes`, `loanTerms`, `team`, `testimonials`, `faqs`
- `contact`: address, opening hours, phone, email, map coordinates
- `WHATSAPP_NUMBER` and `WHATSAPP_GREETING`: the chat the WhatsApp button opens and its pre-filled
  message
- `privacyNotice`: the text shown in the privacy dialog

Section headings and short interface text are written directly in each component.

There are no image files. Houses are drawn by `Facade.tsx` and people by `Avatar.tsx`, both from
settings in the data file.

## How some things work

**Contact form** (`components/Contact.tsx`). Validation runs in the browser and messages appear
under each field. A valid form opens a review dialog; confirming clears the form and shows a
notice for six seconds. Nothing is sent. The handler has a comment marking where a backend call
belongs, and the `clean()` function produces the values that should be sent. A backend must repeat
every validation.

**Themes** (`theme.ts`, `index.css`). The first visit follows the system setting. After the visitor
uses the toggle, the choice is saved in `localStorage` under `theme`. An inline script in
`index.html` applies the theme before first paint. Colours are defined as roles (`--ink`, `--page`,
`--surface`, `--line` and others) that each theme fills in; coloured sections override the roles
locally, and the form and dialogs reset them.

**Credit simulator** (`components/Credits.tsx`). Fixed-rate amortization. The pre-loaded rates are
reference figures, not offers, and are editable by the visitor.

**Map** (`components/Location.tsx`). A sandboxed OpenStreetMap iframe that loads lazily. The marker
is at the centre of Huichapan because the address is fictional.

## Tests

157 unit tests, with 100% statement, branch, function and line coverage enforced by
`npm run coverage`. Besides component behaviour they check:

- `index.html` and the pre-paint theme script (`src/document.test.ts`)
- the stylesheets as text: undefined or unused variables, unused classes, dark theme completeness
  (`src/styles.test.ts`)
- that every in-page link points at an element that exists (`src/App.test.tsx`)
- content consistency (`src/data/site.test.ts`)

The tests run in jsdom, which does not apply CSS. Layout, animations and the real map are not
covered and need checking in a browser.

## Before this goes live

- Connect the contact form to a backend, with server-side validation, rate limiting and spam
  protection, and record the privacy consent.
- Replace the invented content, including the address, map coordinates, phone numbers and the
  `hola@tunuevohogar.com` email, which may belong to someone else.
- Have the privacy notice reviewed against LFPDPPP requirements.
- Add security headers and a Content Security Policy at the host. Allowed outside origins are
  Google Fonts, OpenStreetMap and `wa.me`.
- Consider self-hosting the two fonts instead of loading them from Google Fonts.
