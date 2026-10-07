---
name: camplus-ui
description: Build or adjust CampLus UI consistent with the frozen design system (OKLCH tokens in src/index.css, Noto Sans SC, radix-nova shadcn/ui), accessibility, and desktop-first responsive rules. Use when creating or changing any component, page, or layout, and when verifying UI in the browser.
---

# CampLus UI

The visual direction is **already decided and frozen** (modern, lively, restrained —
现代 / 有活力 / 克制, per `docs/设计原则.md` 原则 9). Do not invent a new aesthetic, do not pull
in a generic "pick a style" design skill. Your job is to stay consistent with the system below.

## Design tokens

- All colour / typography / radius values are OKLCH CSS variables in `src/index.css`, mapped to
  Tailwind via `@theme inline`. Change the look by editing the `:root` and `.dark` blocks — the
  two places — never by hardcoding a hex value or inventing a token inline.
- Use semantic token classes: `bg-background`, `text-foreground`, `bg-card`, `bg-primary`,
  `text-muted-foreground`, `border-border`, `bg-destructive`, the status colours
  (`success` / `warning` / `info`), and the Timeline node colours (`node-announcement`,
  `node-assignment`, `node-exam`, `node-material`, `node-milestone`). Node visual metadata is
  centralised in `src/features/courses/node-meta.ts` — reuse it, don't re-map colours per component.
- Tailwind v4 only sees **full static class strings**. Never build classes dynamically
  (`bg-${type}`); use a lookup object of complete class strings (see `node-meta.ts`).
- Typography: Noto Sans SC for CJK/UI, Geist for Latin/numerals, JetBrains Mono for code — all
  wired through `--font-sans` / `--font-mono`. Sans-serif only (原则 9); no serif body text.
- Both light and dark themes must work; verify against `.dark`.

## Accessibility

- Semantic elements (`button`, `nav`, `main`, headings in order); never a clickable `div`.
- Every control has an accessible name (visible label, `aria-label`, or `sr-only` text). Icon-only
  buttons need a label.
- Preserve visible focus (`outline-ring/50` is set globally) — don't remove outlines.
- Images/icons that convey meaning need alt text or `aria-label`; decorative ones are hidden.
- Dialog/sheet/tooltip from `src/components/ui` (Radix) carry focus-trap and ARIA — prefer them.

## Responsive (desktop-first, mobile degrades to read-only — 原则 10)

- Design the desktop layout first, then ensure it degrades gracefully on narrow screens.
- Do not depend on `hover` for essential information, and do not rely on multi-column
  side-by-side layouts that cannot collapse.
- Mobile is a read-only companion; editing flows may be simplified or deferred on small screens.

## Browser verification (required for UI changes)

Verify the running app with Playwright MCP (`bun dev`, then use the URL printed by Vite —
default port 5173, but it may fall back to another port if 5173 is busy):

1. Navigate to the changed view; take a snapshot.
2. Check a **desktop** viewport (e.g. 1440x900) and a **mobile** viewport (e.g. 390x844).
3. Exercise the key interaction (navigate, open a dialog/sheet, hover/focus a control).
4. Read the **browser console** — there must be no errors or React warnings.
5. Toggle dark mode and confirm tokens still read correctly.

If Playwright MCP is unavailable in the session, say so and fall back to `bunx playwright`
screenshots via Bash, documenting the manual step. For an independent review pass, delegate to
the **ui-reviewer** agent.
