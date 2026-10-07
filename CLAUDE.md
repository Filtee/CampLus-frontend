# CampLus — Frontend

CampLus is a student-governed academic-information platform ("an operating system for
campus academic life"). This repository is the web frontend.

## Source of truth (frozen — do not edit)

Product scope and design rules live in `docs/` and are authoritative:

- `docs/产品定义.md` — what CampLus is, the five core systems, data-source strategy.
- `docs/设计原则.md` — four meta-principles plus product and experience principles.

If a request conflicts with these documents, surface the conflict instead of silently
diverging. Do not modify the documents to make a feature fit — the docs change first,
through the user, then the feature follows.

## Language, comments & Git policy

**Language.** Write all source code, identifiers, file names, comments, tests, developer logs,
configuration comments, technical documentation, skills, and agent instructions in **English**.
Chinese is permitted only when: (a) rendering **user-facing product copy** — the app has no i18n
yet, so existing and new Chinese UI strings may stay Chinese where the current product
experience requires it; keep user-facing strings easy to locate and migrate later, and do not
introduce a speculative or partial i18n system without an approved task; or (b) quoting or
referencing authoritative Chinese product documents, domain terminology, or legally required
wording.

**Comments.** Comment the non-obvious — intent, domain constraints, security considerations,
compatibility workarounds, or unusual decisions. Never add comments that merely restate the code.

**Git.** Never create a commit automatically, and never run `git add`, `git commit`, `git push`,
`git rebase`, `git commit --amend`, `git tag`, or release commands unless the user explicitly
instructs you to execute them. When a commit would be appropriate, instead propose: the exact
Conventional Commit message, an optional body, the exact files that belong in the commit, and
separate commit proposals when the changes cover independent concerns.

## Stack

React 19 · TypeScript 6 (strict, type-checked lint) · Vite 8 · Bun · TanStack Router
(file-based, auto code-split) + TanStack Query · Tailwind CSS v4 (CSS-first `@theme`) ·
shadcn/ui (`radix-nova`) · MSW · Vitest + Testing Library.

## Commands (Bun)

| Task                 | Command                                      |
| -------------------- | -------------------------------------------- |
| Dev server           | `bun dev`                                    |
| Production build     | `bun run build` (`tsc -b` then `vite build`) |
| Type-check           | `bun run typecheck`                          |
| Lint                 | `bun run lint`                               |
| Format check / write | `bun run format` / `bun run format:write`    |
| Tests (run / watch)  | `bun run test` / `bun run test:watch`        |

## Architecture

- **Feature slices** live in `src/features/<feature>/{api,components,pages}`. Cross-feature
  primitives go in `src/components/{ui,common,layout}` and `src/lib`. Keep a change inside
  its slice; reach for shared primitives before adding new ones.
- **Routing**: `src/routes/**` is file-based. Route files stay thin — they import and render
  a page from a feature slice. `src/routeTree.gen.ts` is **generated** (never edit).
- **Data layer**: every network call goes through `src/lib/http.ts`. Per feature, expose a
  `xxxApi` object + a `xxxKeys` query-key map + `useXxx` TanStack Query hooks. Mirror
  `src/features/courses/api/courses.ts`. No raw `fetch` in components.
- **Types as contract**: `src/types/index.ts` is the backend contract, derived from the
  product doc. MSW handlers in `src/mocks/` return data isomorphic to those types — keep the
  two in sync when either changes.
- **Design tokens**: all colour / typography / radius values are OKLCH CSS variables in
  `src/index.css`. Use semantic token classes (`bg-primary`, `text-muted-foreground`,
  `bg-node-exam`, …). Never hardcode hex or invent ad-hoc tokens — edit the `:root` / `.dark`
  blocks instead. Tailwind v4 scans source for full static class strings: no `bg-${x}`.

## Product rules that constrain engineering

From `docs/设计原则.md` — not optional:

- **Real-name only** (原则 1): every contribution ties to a real identity. There is no
  anonymous path anywhere — not in the data model, not in the UI.
- **Authorization** (原则 2): defined in `docs/设计原则.md` and authoritative — do not
  re-interpret or re-model it here. Per that document, teachers are not super-admins: their
  permissions are a subset of students' plus a limited annotation ability (e.g. mark official,
  correct factual errors, respond to evaluations), and never a superset (they may not delete
  student-authored content, read a student's private evaluation drafts, or view personal-
  homepage data). Before writing any authorization logic, re-read 原则 2; if a requirement
  seems to need a capability the document does not grant, **stop and surface the conflict** with
  the maintainers rather than encoding a new rule here.
- **Traceable power** (原则 4): edits record editor + time + summary; version history is
  append-only (no destructive deletion of past versions).
- **Structured, not a feed** (原则 5): no global timeline, ranking, or recommendations;
  content is anchored to an entity and search is intent-driven. Discussions attach to a
  concrete node/entity (原则 3) — never free-standing posts.

## Design & UX

- The aesthetic is **already decided** (modern, lively, restrained — 现代 / 有活力 / 克制)
  and encoded in the token system and Noto Sans SC. Do not invent a new visual direction.
- **Desktop-first; mobile degrades to read-only** (原则 10): do not depend on hover or on
  multi-column side-by-side layouts for core flows; ensure graceful mobile degradation.
- Empty states are starting-point hints, not blank pages (原则 8). Error messages state what
  happened and what the user can do next.
- Accessibility: semantic HTML, labelled controls, visible focus (`outline-ring`), and
  adequate contrast in both themes.
- Use the **camplus-ui** skill when building or adjusting UI, and the **camplus-feature**
  skill when adding a feature slice.

## Workflow

1. **Plan before implementing** non-trivial work: agree the slice / route / types shape first.
2. After changes, run `bun run typecheck` → `bun run lint` → `bun run test`.
3. For UI, verify in a real browser via Playwright MCP at a desktop **and** a mobile viewport,
   and check the console for errors.

## Generated vs. managed files

- **Generated — never hand-edit:** `src/routeTree.gen.ts` (TanStack Router) and
  `public/mockServiceWorker.js` (MSW). Change the sources, not these.
- **Managed shared design-system primitives:** `src/components/ui/**` (shadcn). Ordinary
  feature work should **reuse** these without modifying them; an explicit shared-primitive task
  may change them after an impact review. Edits here prompt for confirmation.
- **Frozen product docs:** `docs/**` are the source of truth and must not be changed unless the
  maintainer explicitly requests a product-document change. Edits here prompt for confirmation.
