# KELARUS

The main KELARUS application: a React + TypeScript single-page app built
with Vite. See the root `README.md` for workspace setup.

## Stack

- React 19 with the React Compiler, TypeScript, Vite
- Tailwind CSS v4 and [shadcn/ui](https://ui.shadcn.com) (Base UI primitives)
- React Router for routing
- react-i18next for Indonesian and English copy
  ([ADR-0001](../../docs/adr/0001-use-react-i18next-for-translations.md))
- Oxlint for linting

## Scripts

Run from this directory, or from the repo root with `pnpm --filter core <script>`.

| Script         | What it does                        |
| -------------- | ----------------------------------- |
| `pnpm dev`     | Start the dev server                |
| `pnpm build`   | Type-check and build for production |
| `pnpm lint`    | Lint with Oxlint                    |
| `pnpm preview` | Serve the production build locally  |

## Structure

```
src/
├── app/               Router and app-level pages (404)
├── components/        Shared components and layouts
│   └── ui/            shadcn/ui components (generated, see below)
├── features/
│   ├── auth/          Authentication pages, guards, session, validation
│   └── dashboard/     Dashboard placeholder
├── i18n/              i18next setup and locale files
└── lib/               Utilities
```

Import from `src` with the `@/` alias, for example `@/components/ui/button`.

## UI components

Add shadcn/ui components with the CLI instead of writing them by hand:

```sh
pnpm dlx shadcn@latest add <component>
```

Files in `src/components/ui/` are generated. Edit them only when the change
should apply everywhere the component is used.

## Translations

All user-facing copy lives in `src/i18n/locales/`:

- `en.ts` defines the keys. `id.ts` is typed against it, so a missing
  Indonesian key fails the build.
- In components, use `const { t } = useTranslation()` and `t("section.key")`.
  Keys are type-checked.
- For copy stored in state and rendered later (validation errors, notices),
  store the key rather than the text so it follows a language change. See
  `Message` in `src/features/auth/validation.ts`.

The language is detected from `localStorage` (`kelarus.language`), then the
browser, and falls back to Indonesian. Users switch it from the language
menu in the page header.

## Authentication

Pages and flows follow
[`docs/reference/authentication.md`](../../docs/reference/authentication.md).

The backend is not usable yet, so `src/features/auth/api.ts` simulates the
account service. Every call waits 600 ms and succeeds, except for these
inputs, which return the matching API error:

| Page                         | Input                        | Result                     |
| ---------------------------- | ---------------------------- | -------------------------- |
| Login                        | email `wrong@...`            | `INVALID_CREDENTIALS`      |
| Login                        | email `pending@...`          | `ACCOUNT_NOT_ACTIVE`       |
| Register                     | email `taken@...`            | `EMAIL_ALREADY_REGISTERED` |
| Verify email, reset password | `?token=expired`             | Expired token              |
| Verify email, reset password | `?token=invalid` or no token | Invalid token              |
| Change password              | current password `wrongpass` | `CURRENT_PASSWORD_INVALID` |

To wire the real backend, replace the function bodies in `api.ts`. Pages
already handle `ApiError` by its `code`. Session persistence is isolated in
`session-storage.ts`.
