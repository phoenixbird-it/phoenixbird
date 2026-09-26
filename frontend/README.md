# PHOENIX BIRDS — Frontend

React + TypeScript + Vite site for PHOENIX BIRDS, a manpower supply and facility services
company in Madurai, Tamil Nadu.

## Scripts

```bash
npm run dev      # dev server on http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # serve the production build
npm run lint     # oxlint
```

The API base URL comes from `VITE_API_BASE_URL` (see `.env.development`).
Every page renders its loading / error / empty states, so the site stays usable when the
Django API is unreachable.

> Deployment note: this is a client-side routed SPA. The host must serve `index.html`
> for unknown paths (e.g. `/about`), otherwise deep links will 404.

## Structure

```
src/
  assets/scss/     global styles (see "Styling" below)
  components/      reusable UI, one folder per component + co-located *.module.scss
  data/            static content fixed by the brief (nav, why-choose-us, workflow, about copy)
  hooks/           useCompanySettings (cached singleton), useAsyncData (loading/error/empty)
  layouts/         MainLayout — navbar, outlet, footer, WhatsApp button, mobile contact bar
  pages/           one folder per route + co-located *.module.scss
  services/        apiClient + typed API functions
  types/           shared API interfaces
  utils/           company settings formatting, media URLs, validation, WhatsApp links
```

## Styling

SCSS with CSS modules per component/page, on top of a small global layer:

| File | Purpose |
| --- | --- |
| `assets/scss/_variables.scss` | design tokens (navy/gold palette, spacing, breakpoints) |
| `assets/scss/_mixins.scss` | `up()` / `down()` media queries, `container`, `card`, `auto-grid` |
| `assets/scss/_abstracts.scss` | `@forward` of the two above |
| `assets/scss/main.scss` | reset, base elements, global classes (`.container`, `.btn`, `.section`, `.eyebrow`, `.srOnly`) — imported once in `main.tsx` |

`_abstracts.scss` is auto-injected into every `*.module.scss` by `vite.config.ts`, so component
styles can use tokens and mixins without a boilerplate `@use` line. Global stylesheets under
`assets/scss/` are excluded from that injection to avoid a circular import.

Breakpoints are mobile-first: `sm` 576px, `md` 768px, `lg` 992px, `xl` 1200px.

## Content rules

Phone numbers, email addresses, WhatsApp number, address, office hours, social links and the
logo are **always** read from `GET /company-settings/` via `useCompanySettings()` — never
hard-coded. Anything that is blank is simply not rendered (no empty `tel:` links).
