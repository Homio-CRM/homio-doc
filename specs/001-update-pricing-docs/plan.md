# Implementation Plan: Update Pricing Documentation to Match Source of Truth

**Branch**: `001-update-pricing-docs` | **Date**: 2026-04-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-update-pricing-docs/spec.md`

## Summary

Update `content/docs/costs.mdx` so every price matches the reconciled values in the source-of-truth PDF (`1776433739696-comparativo-completo-custos-homio.pdf`, 2026-04-08). Nine existing rows get updated values, two new rows are added in a new `## IA de Conteúdo (Content AI)` section, and decimal notation is normalized to US format (period). No other files change. This is a pure content edit to a Fumadocs MDX site — no code, no data model, no APIs.

## Technical Context

**Language/Version**: MDX (Markdown + JSX) — content only; no runtime code changes
**Primary Dependencies**: Fumadocs (fumadocs-core 16.0.11, fumadocs-mdx 13.0.8, fumadocs-ui 16.0.11), Next.js 16.1.6 — already installed, no changes
**Storage**: N/A (static content file)
**Testing**: Manual verification via `npm run dev` (http://localhost:3000/docs/costs); no automated tests apply to prose/table content
**Target Platform**: Documentation site rendered by Fumadocs/Next.js — affects only the rendered `/docs/costs` route
**Project Type**: Fumadocs-based documentation site (Next.js app under `src/`, content under `content/docs/*.mdx`)
**Performance Goals**: N/A — static content change; no perceptible impact on build time or page render
**Constraints**: MDX must parse cleanly (valid table syntax, matching `<Callout>` tags, consistent frontmatter); build must pass
**Scale/Scope**: Single file (`content/docs/costs.mdx`), ~11 price updates/additions, one new section, local prose updates to match new figures

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is an unfilled template with placeholder principles. No concrete gates to evaluate. Proceeding is safe — this is a low-risk documentation edit with no code, test, or architectural impact. Noted as a project-level gap, not a blocker for this feature.

**Result**: PASS (no enforceable principles defined; this feature introduces no architectural concerns regardless).

## Project Structure

### Documentation (this feature)

```text
specs/001-update-pricing-docs/
├── plan.md              # This file
├── spec.md              # Feature spec (with Clarifications)
├── research.md          # Phase 0 — source-of-truth reconciliation notes
├── data-model.md        # Phase 1 — entities, price-update mapping, validation rules
├── quickstart.md        # Phase 1 — reviewer verification guide
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit.specify)
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

**Intentionally omitted**:
- `contracts/` — Skipped per the Phase 1 skill instruction: *"Skip if project is purely internal (build scripts, one-off tools, etc.)"*. This feature introduces no new API, CLI grammar, MCP resource, or external interface. The customer-facing "contract" of the cost documentation page is the rendered Markdown content itself, which is already specified row-by-row in `spec.md` (FR-001, FR-002) and `data-model.md` (Price Update Mapping table).

### Source Code (repository root)

Only one file changes in this feature:

```text
content/docs/
└── costs.mdx            # ← the only file touched by this feature

# Reference (unchanged, for context):
content/docs/*.mdx       # other docs pages — verified grep-clean of numeric pricing
src/                     # Next.js app (layout, routing) — no changes
public/                  # static assets — no changes
source.config.ts         # Fumadocs MDX config — no changes
```

**Structure Decision**: Edit `content/docs/costs.mdx` in place. The file's existing section hierarchy is preserved; one new section (`## IA de Conteúdo (Content AI)`) is inserted between `## IA de Conversação` and `## IA de Voz` per clarification Q1. No other files in the repository reference numeric prices (verified by content search), so this is a single-file change.

## Implementation Approach

1. **Direct edits to the existing tables** in `costs.mdx`. Use Edit tool with old_string/new_string for each row — no rewrite of the file.
2. **Insert one new section** (`## IA de Conteúdo (Content AI)`) between lines 111 (end of Conversation AI section) and 113 (start of Voice AI section), with a 2-row Markdown table.
3. **Normalize decimal notation** to US format (period) in all updated rows for consistency with the source-of-truth PDF and the majority of existing prices in the doc.
4. **Verify surrounding prose** (callouts, section intros) for any stale figure references; update inline mentions to match the new tabular values.
5. **Validate** by running `npm run dev` and visually confirming the rendered `/docs/costs` page against the PDF's "Valor Correto" column.

## Complexity Tracking

*No constitution violations to track. No complexity concerns for a single-file documentation edit.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |
