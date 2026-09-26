# 0001. Use react-i18next for translations

- Status: Accepted
- Date: 2026-09-27

## Context

`apps/core` must ship in Indonesian and English, and users must be able to
switch between them at runtime. Copy was hardcoded in English across the
authentication pages, so every new page would add more strings to migrate.

Requirements:

- Switch language without a reload, and remember the choice.
- Catch missing translations and mistyped keys at build time.
- Translate messages that are stored in state and rendered later, such as
  validation errors and notices passed through router state, so they follow
  a language change.
- Keep the setup small; the app is a client-rendered Vite SPA.

## Decision

Use `i18next` with `react-i18next` and `i18next-browser-languagedetector`.

- Locales live in `apps/core/src/i18n/locales/` as TypeScript objects, one
  file per language. `en.ts` defines the shape; `id.ts` is typed against it.
- `src/i18n/i18next.d.ts` registers the English shape with i18next, so `t()`
  only accepts existing keys.
- Code that stores copy for later keeps a translation key (`MessageKey`),
  or a key plus interpolation values (`Message`), never rendered text.
- Detection order is `localStorage` (`kelarus.language`), then the browser
  language. The fallback is Indonesian (`id`).

## Alternatives considered

- **Lingui**: compile-time extraction with a macro. Needs an extra Babel or
  SWC step and a catalog compile step, which is more tooling than two
  languages need today.
- **Paraglide**: compiled, tree-shaken message functions. Good bundle size,
  but a younger ecosystem and a code generation step in the build.
- **Hand-rolled context with a dictionary**: no dependency, but we would
  rebuild interpolation, rich text (`<Trans>`), detection, and persistence.

## Consequences

- Grew the bundle by about 81 kB minified (26 kB gzip), measured when
  adopted, including both locale files.
- All locales are bundled up front. Splitting them per language or feature
  is possible later with i18next backends or dynamic imports.
- Adding a language means adding a locale file typed as `Messages` and
  listing it in `LANGUAGES`.
- Translators edit TypeScript files. If non-developers need to edit copy,
  move the locales to JSON and keep the type check through `typeof` imports.
