# Phase 0 Research: Pricing Documentation Update

**Feature**: 001-update-pricing-docs
**Date**: 2026-04-17

## Context

There are no NEEDS CLARIFICATION markers in Technical Context, and no technology choices to evaluate — the Fumadocs/MDX stack is already in place and no dependencies change. The only "research" required for this feature is the price reconciliation itself, which was performed outside the repository and delivered as the source-of-truth PDF. This document captures the key decisions made from that reconciliation so future readers don't need to re-derive them from the PDF.

## Source of Truth

**Document**: `1776433739696-comparativo-completo-custos-homio.pdf` (2026-04-08), committed at repo root.
**Scope**: Line-by-line comparison of three sources:
- **A** — Current public documentation (`docs.homio.com.br/docs/costs`)
- **B** — Rebilling platform values (Claude collection from `app.homio.com.br`, BRASMETAL account, charged-to-customer column with 2× markup)
- **C** — User-informed values (product/finance team reporting)

**Reconciled output**: The PDF's "Resumo — O que Atualizar na Documentação" table, which lists the final "Valor Correto" for each item where B and C agree or where the user's value is deemed more precise.

## Decision Log

### D-1: Use the PDF's "Valor Correto" column as the canonical price list

- **Decision**: Every price change in this feature takes its value verbatim from the PDF's summary table.
- **Rationale**: The PDF already performed the reconciliation between rebilling, user-reported, and documentation values, and flagged status (DOC DESATUALIZADA, DOUBLE CHECK, etc.). The rows marked "B e C concordam" are directly actionable; the rows marked "confirmar" were explicitly handled in the clarifications (see D-4 through D-6 below).
- **Alternatives considered**:
  - Re-verify each price directly in the rebilling UI → rejected; would duplicate work already captured in the PDF, and the PDF was produced specifically for this purpose.
  - Use only rows where B and C agree → rejected; would leave WhatsApp and outbound items stale, which are among the most visible prices in the doc.

### D-2: Normalize decimal notation to US format (period separator)

- **Decision**: All updated prices use `$X.XX` format with a period as decimal separator. Existing untouched prices that already use period stay; existing comma-separated prices in the WhatsApp and E-mail sections are normalized to period as they are updated.
- **Rationale**: (a) The source-of-truth PDF uses period notation throughout. (b) The majority of existing prices in `costs.mdx` already use period (all phone tariffs, automations, AI tables). (c) Consistency across a single table is more valuable than honoring the Portuguese locale convention in a doc that is already mixed.
- **Alternatives considered**:
  - Normalize everything to comma (Brazilian locale) → rejected; would require touching sections out of scope (phone tariffs, AI tables) and diverge from the source PDF.
  - Leave the mix as-is → rejected; produces visually inconsistent rows within the same feature change.

### D-3: Single-file edit in `content/docs/costs.mdx`

- **Decision**: The entire feature is delivered by editing `content/docs/costs.mdx`. No other file in the repository is modified.
- **Rationale**: Verified by content search (`grep` for `$`, `US$`, numeric pricing patterns, Portuguese "custo"/"preço") across `content/docs/*.mdx`. Only `costs.mdx` contains numeric prices; other docs mention cost concepts in prose without specific figures. No navigation metadata (`meta.json`) changes because the page itself stays in place.
- **Alternatives considered**:
  - Extract prices into a shared data file and import → rejected; over-engineering for 11 values in a single page, adds build complexity with zero reuse benefit.

### D-4: Content AI placement — new dedicated section (clarification Q1)

- **Decision**: Insert a new `## IA de Conteúdo (Content AI)` section between the existing `## IA de Conversação` and `## IA de Voz` sections, containing a 2-row table (Texto `$0.18/1.000 palavras`, Imagem `$0.12/imagem`).
- **Rationale**: Mirrors the structure of the two existing AI sections (own heading, own table, own pricing basis), keeps the three IA families visually grouped, and avoids overloading the generic `## Outros` section with AI-specific pricing.
- **Alternatives considered**: Add rows to `## Outros`; append as a subsection under `## IA de Conversação`. Both rejected per the clarification record in `spec.md`.

### D-5: Exclude `$0.028/min` outbound rebilling reference (clarification Q2)

- **Decision**: The outbound calls table keeps only the three Brazilian destination tariffs (Celular `$0.0868`, Grandes Cidades `$0.0308`, Geral `$0.056`). The PDF's `$0.028/min` platform-default reference is not added.
- **Rationale**: `$0.028/min` is a US/Twilio platform default that does not apply to Brazilian outbound and would confuse customer-facing readers who are billed at the destination-tiered rates.
- **Alternatives considered**: Add as a separate "Outros destinos" row; add as a callout. Both rejected per the clarification record.

### D-6: Validation display format — `$5.00/1.000 validações` (clarification Q3)

- **Decision**: Display Validação de E-mail as `$5.00/1.000 validações`, not the equivalent `$0.005/verificação`.
- **Rationale**: The sibling E-mail envio row uses per-thousand format (`$1.35/1.000 emails`); keeping both e-mail-related rows in the same unit makes them directly comparable at a glance. Both formats represent identical pricing.
- **Alternatives considered**: Per-unit (`$0.005/verificação`), or show both. Both rejected per the clarification record.

### D-7: Agent Studio deliberately excluded

- **Decision**: No row is added for Agent Studio in this feature.
- **Rationale**: The PDF explicitly marks Agent Studio as "INCLUIR após confirmar" — it appeared only in user-reported values ($0.2625/750.000 words, GPT-4.1 reference) and could not be confirmed on the rebilling side because it is grouped under Conversation/Voice AI. Adding an unconfirmed price to customer-facing documentation would violate the feature's premise of using the PDF as source of truth.
- **Alternatives considered**: Add with a disclaimer → rejected; mixes confirmed and unconfirmed prices, dilutes trust in the document.

### D-8: Validation approach — manual visual review

- **Decision**: No automated test is added. Validation is: (1) build passes (`npm run dev`), (2) rendered `/docs/costs` page is visually compared against the PDF's "Valor Correto" column.
- **Rationale**: This is a prose/table content edit. The repository has no test infrastructure targeting MDX content, and creating one for 11 literal price strings would be disproportionate. The acceptance scenarios in the spec are already literal value checks that a human reviewer can run against the PDF in under 5 minutes.
- **Alternatives considered**: Add an MDX snapshot test or a Playwright visual regression check → rejected; would introduce net-new tooling for a one-shot change.

## Open Items

None. All clarifications are resolved in `spec.md`, and no technical unknowns remain for Phase 1.
