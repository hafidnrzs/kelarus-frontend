# AGENTS.md

Frontend monorepo for KELARUS, managed with pnpm workspaces. See `README.md`
for setup and commands.

- `apps/core`: React + TypeScript + Vite, the main application
- `apps/marketing`: Astro landing site, with its own `AGENTS.md`
- `packages/`: shared packages

## Commit messages

Follow https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html.
Do not use Conventional Commits prefixes such as `feat:` or `chore:`.

- Subject line: capitalized, imperative mood ("Add", not "Added"), no
  trailing period, 50 characters max.
- Second line: blank.
- Body: wrap at 72 characters. Explain what and why, not how, since
  `git blame` is the main way to recover context.
- These line limits apply to commit messages only. PR descriptions,
  Markdown files, and code comments are not subject to them.

## Git workflow

- `main` is the default branch. Work on a feature branch and open a PR.
- Each commit is one logical change that builds on its own.
- Fold fixups into the commit they fix before merging. No "WIP",
  "fix typo", or "address review" commits on `main`.
- PRs merge with a merge commit, not squash or rebase.

## Code comments

- Inside a function body: one line max per comment.
- Docstrings are allowed. State what and why briefly; do not restate the code.
- Put longer rationale in an ADR (see below), not in comments. A one-line
  reference such as `// See ADR-0003` is fine.

## Documentation

All Markdown documentation lives in `docs/`. The only exceptions are
`README.md` and `AGENTS.md` files.

| Path              | Content                                                        |
| ----------------- | -------------------------------------------------------------- |
| `docs/specs/`     | Feature specs: what to build and why                           |
| `docs/plans/`     | Implementation plans                                           |
| `docs/adr/`       | Architecture Decision Records, named `NNNN-kebab-case-title.md` |
| `docs/reference/` | Stable facts to build against, e.g. backend API contracts      |
| `docs/scratch/`   | Personal drafts, gitignored. Not a source of truth; do not cite |

Delete a scratch file once its content moves to a spec, reference, or ADR.

## Superpowers skills

These rules override the skill defaults:

- Save specs to `docs/specs/` and plans to `docs/plans/`, not
  `docs/superpowers/`.
- A plan is a list of tasks. Each task states its goal and the files or
  areas it touches. Do not include commands to run or code to write.
- During brainstorming, if a chosen approach is cross-cutting or costly to
  reverse, record it as an ADR in `docs/adr/` and link it from the spec.
