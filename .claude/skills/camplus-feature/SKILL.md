---
name: camplus-feature
description: Scaffold or extend a CampLus feature slice (types -> MSW mock -> TanStack Query API hooks -> components -> page -> route) following the repo's established patterns. Use when adding or significantly extending a feature under src/features.
---

# Adding a CampLus feature slice

Follow the existing `courses` slice as the reference implementation. Build in this order so
each layer has something concrete to depend on.

## 1. Domain types (`src/types/index.ts`)

`src/types/index.ts` is the backend contract, derived from `docs/产品定义.md`. Add or extend
interfaces there — do not scatter ad-hoc types in components. Encode the product invariants in
the types: real-name identity (no anonymous author shape), append-only edit history, source
attribution. Mock data and the eventual real API must both satisfy these types.

## 2. Mock data + handlers (`src/mocks/`)

- Add fixtures to `src/mocks/data.ts` typed against `src/types`.
- Add MSW handlers in `src/mocks/handlers.ts`. Match the real REST shape you expect the backend
  to expose (e.g. `/api/<resource>`), use `delay()` to keep loading states honest, and return
  `HttpResponse.json(...)` of data isomorphic to the domain types. Return `404` for misses.

## 3. API + Query hooks (`src/features/<feature>/api/<feature>.ts`)

Mirror `src/features/courses/api/courses.ts` exactly:

- a `<feature>Api` object whose methods call `get<T>()` from `src/lib/http.ts` (never raw `fetch`);
- a `<feature>Keys` map of query keys (`as const`);
- `useXxx` hooks wrapping `useQuery`, using `enabled` for dependent queries.

## 4. Components (`src/features/<feature>/components/`)

Presentational components take typed props and render domain data. Reuse `src/components/ui`
(shadcn) and `src/components/common` before adding primitives. Follow the **camplus-ui** skill
for tokens, accessibility, and responsive behaviour.

## 5. Page (`src/features/<feature>/pages/<feature>-page.tsx`)

The page composes the Query hooks and components. Handle the three states explicitly: loading
(skeletons), empty (an `EmptyState` starting-point hint, not a blank page), and error (say what
happened + what to do).

## 6. Route (`src/routes/...`)

Add a thin file-based route that imports and renders the page. Keep logic out of the route.
`src/routeTree.gen.ts` regenerates automatically — never edit it by hand.

## Checks

Run `bun run typecheck`, `bun run lint`, and `bun run test`. Add at least one meaningful test
(pure logic in `src/lib`, or a component rendering real domain data). Verify the UI in the
browser per the **camplus-ui** skill.
