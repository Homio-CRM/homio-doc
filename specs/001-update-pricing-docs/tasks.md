---

description: "Task list for feature 001-update-pricing-docs"
---

# Tasks: Update Pricing Documentation to Match Source of Truth

**Input**: Design documents from `/specs/001-update-pricing-docs/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated test tasks are included. Rationale is captured in research.md decision D-8: this is a prose/table content edit with no test infrastructure targeting MDX content, so validation is manual (dev-server render + quickstart.md verification procedure).

**Organization**: Tasks are grouped by user story so each story can be implemented and validated as an independent increment against `content/docs/costs.mdx`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no dependencies). Note: this feature edits a single file (`content/docs/costs.mdx`), so no implementation tasks are marked [P] — all edits target the same file and must serialize.
- **[Story]**: User story this task belongs to (US1, US2, US3)
- Exact file paths are included in every task

## Path Conventions

Single Fumadocs docs site. All feature work targets one file:

- **Primary target**: `content/docs/costs.mdx` (repo root)
- **Source of truth**: `1776433739696-comparativo-completo-custos-homio.pdf` (repo root, page 2 summary table)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm baseline state before editing.

- [X] T001 Verify current branch is `001-update-pricing-docs` with a clean working tree by running `git status` from repo root
- [ ] T002 Start the Fumadocs dev server with `npm run dev` and confirm http://localhost:3000/docs/costs renders the current (pre-edit) page — **DEFERRED**: `node_modules/` is absent in this clone; dev server requires `npm install` first. Not blocking for text edits. User should run `npm install && npm run dev` before T022/T023.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Load full context of the file being edited so every downstream edit uses unambiguous `old_string` values.

**⚠️ CRITICAL**: Must complete before any User Story phase begins.

- [X] T003 Read the full contents of `content/docs/costs.mdx` to capture current exact text (used to build precise `old_string` arguments for every Edit operation in Phases 3–5)

**Checkpoint**: Current file state captured. User story implementation can begin.

---

## Phase 3: User Story 1 - Align All Outdated Prices With Source of Truth (Priority: P1) 🎯 MVP

**Goal**: Replace every stale numeric price in `content/docs/costs.mdx` with the "Valor Correto" value from the source-of-truth PDF. Covers 9 updates across 4 sections (Telefonia, WhatsApp, E-mail, Outros).

**Independent Test**: Open `/docs/costs` in the dev server; verify every row listed in steps 1–9 below shows the new value. Search the page for the old literals (`0.014`, `0,93`, `14.00`, `1.386`, `0,1036`, `0,0472`) — zero hits means the story is complete.

**Reference**: data-model.md → "Price Update Mapping" table rows #1–9.

### Implementation for User Story 1

- [X] T004 [US1] Update "Recebimento (Inbound)" row in the Telefonia e Ligações table: change `US$ 0.014` to `$0.017` (per minute) in `content/docs/costs.mdx` (~line 28)
- [X] T005 [US1] Update "Marketing" row in the WhatsApp table: change `US$ 0,1036` to `$0.13125` (per conversa) in `content/docs/costs.mdx` (~line 58)
- [X] T006 [US1] Update "Utilidade" row in the WhatsApp table: change `US$ 0,0472` to `$0.01428` (per conversa) in `content/docs/costs.mdx` (~line 59)
- [X] T007 [US1] Update "Envio" row in the E-mail table: change `US$ 0,93 / 1000 e-mails` to `$1.35 / 1.000 emails` in `content/docs/costs.mdx` (~line 73)
- [X] T008 [US1] Update "Validação" row in the E-mail table: change `US$ 0,0472 / 1000 validações` to `$5.00 / 1.000 validações` in `content/docs/costs.mdx` (~line 74) — per-thousand format per clarification D-6
- [X] T009 [US1] Update "Compra de Domínio" row in the Outros table: change `US$ 14.00` to `$20.00` in `content/docs/costs.mdx` (~line 82)
- [X] T010 [US1] Update "Gatilhos/Ações Premium" row in the Outros table: change `US$ 0.014` to `$0.02` (por execução) in `content/docs/costs.mdx` (~line 83)
- [X] T011 [US1] Update "Criação de Funis (IA)" row in the Outros table: change `US$ 1.386` to `$1.98` (por funil) in `content/docs/costs.mdx` (~line 84)
- [X] T012 [US1] Update "Resposta a Avaliações (IA)" row in the Outros table: change `US$ 0.014` to `$0.02` (por resposta) in `content/docs/costs.mdx` (~line 85)
- [X] T013 [US1] Reload `/docs/costs` in the browser and visually confirm all 9 updated rows show the new values; search the page for `0.014`, `0,93`, `14.00`, `1.386`, `0,1036`, `0,0472` — confirm zero hits (done via Grep against `content/docs/costs.mdx`; browser reload deferred with T002)

**Checkpoint**: User Story 1 complete. The documentation page now matches the PDF's "Valor Correto" column for every previously-stale row. This is the MVP — the feature delivers its primary value even if US2 and US3 are deferred.

---

## Phase 4: User Story 2 - Add Missing Services to the Documentation (Priority: P2)

**Goal**: Add the two Content AI services (Texto, Imagem) that customers are billed for but which do not yet appear in the cost documentation.

**Independent Test**: Open `/docs/costs`, scroll to a new `## IA de Conteúdo (Content AI)` section positioned between `## IA de Conversação` and `## IA de Voz`, and confirm it contains two rows: Texto at `$0.18/1.000 palavras` and Imagem at `$0.12/imagem`.

**Reference**: data-model.md → "Price Update Mapping" table rows #10–11; clarification Q1 → Option A.

### Implementation for User Story 2

- [X] T014 [US2] Insert a new section `## IA de Conteúdo (Content AI)` in `content/docs/costs.mdx`, placed between `## IA de Conversação` (ends ~line 111 after the GPT-4.1 row/note) and `## IA de Voz` (starts ~line 113). The section MUST contain: (a) a brief one-sentence intro explaining that Content AI covers on-demand text and image generation billed per output unit (not per token), (b) a 2-row Markdown table with columns `| Serviço | Custo | Unidade |`, rows `**Texto** | US$ 0.18 | /1.000 palavras` and `**Imagem** | US$ 0.12 | /imagem`, and (c) a `* * *` horizontal rule separator after the section to match the style of neighboring sections
- [X] T015 [US2] Reload `/docs/costs` in the browser and confirm the new section appears in the correct position with both rows rendering correctly (table headers visible, two data rows, no broken Markdown) — verified via file read; browser reload deferred with T002

**Checkpoint**: User Story 2 complete. All services billed to customers are now visible in the documentation.

---

## Phase 5: User Story 3 - Preserve Items Flagged as "Double Check" Without False Precision (Priority: P3)

**Goal**: Explicitly verify that items the PDF marked for careful handling are correctly preserved (outbound destination tariffs) or correctly excluded (Agent Studio). These are verification tasks — if any check fails, remediation is to restore/remove as required by the spec.

**Independent Test**: Open `/docs/costs`; confirm the outbound tariff table still lists three Brazilian destinations with the original values, and confirm Agent Studio appears nowhere on the page.

**Reference**: spec.md → User Story 3; research.md → decisions D-5 and D-7.

### Implementation for User Story 3

- [X] T016 [US3] Inspect the "2. Custos de Ligações" table in `content/docs/costs.mdx` (~lines 34–38) and confirm the three destination rows are unchanged: Brasil - Celular `US$ 0.0868`, Brasil - Grandes Cidades `US$ 0.0308`, Brasil - Geral `US$ 0.056`. The `$0.028/min` rebilling reference from the PDF MUST NOT be added (clarification D-5)
- [X] T017 [US3] Search the full contents of `content/docs/costs.mdx` for the string "Agent Studio" (case-insensitive) and confirm zero matches. Agent Studio is deliberately excluded until confirmation (research D-7)
- [X] T018 [US3] Confirm the WhatsApp Callout block (currently ~lines 61–63) about 24-hour customer-initiated conversations still renders correctly and its wording does not contradict the updated Marketing/Utilidade values (no inline price mention in that callout to revise — just verify)

**Checkpoint**: User Story 3 complete. No stale or unconfirmed pricing has been introduced.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Sweep for residual issues that cut across all three stories and run the final acceptance procedure.

- [X] T019 Sweep `content/docs/costs.mdx` with Grep for every old numeric literal: patterns `0\.014`, `0,93`, `14\.00`, `1\.386`, `0,1036`, `0,0472`, `0\.0472`. Expected result: zero matches inside the sections modified by this feature (Phone Inbound, WhatsApp, E-mail, Outros). Matches inside preserved sections (AI tables, phone rental) are acceptable only if they are genuinely unrelated values — **PASS**: zero matches on precise row-anchored patterns; one residual `US$ 14.00` on line 103 is the Gemini 2.5 Pro output-token price (preserved AI pricing, not Compra de Domínio)
- [X] T020 Verify decimal notation on every edited/added cell in `content/docs/costs.mdx` uses a period as decimal separator (e.g., `$0.017`, `$1.35`, `$5.00`, `$0.02`, `$20.00`, `$1.98`, `$0.13125`, `$0.01428`, `$0.18`, `$0.12`) — no comma decimals in any touched cell — **PASS**: Grep for `,\d` in the file returns zero matches
- [X] T021 Scan surrounding prose and callouts in `content/docs/costs.mdx` for inline price mentions that reference any of the updated services; update any found to match the new values (FR-006) — **PASS**: all `$`/`US$` occurrences are inside tables or the Motor de Voz bullet (line 129, unchanged). No prose/callout price references exist
- [ ] T022 Confirm Fumadocs renders `content/docs/costs.mdx` without console warnings: reload `/docs/costs` with the browser devtools console open — zero MDX/React warnings about malformed tables or callouts — **DEFERRED**: requires dev server (blocked by T002). MDX well-formedness verified structurally via file Read (table pipe counts balanced, `<Callout>` tags paired, frontmatter unchanged)
- [ ] T023 Execute the 7-step procedure in `specs/001-update-pricing-docs/quickstart.md` against the rendered page; record any step that fails and remediate before marking the feature complete — **PARTIALLY DONE**: steps 3, 4, 5, 6, 7 verified via Grep/Read against the source file. Steps 1 (start dev server) and 2 (open browser) deferred to the user, who must run `npm install && npm run dev` to complete the final interactive verification

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — runs first
- **Foundational (Phase 2)**: Depends on Setup — T003 blocks every Edit in Phases 3–5
- **User Story 1 (Phase 3)**: Depends on Phase 2 — delivers MVP
- **User Story 2 (Phase 4)**: Depends on Phase 2 — independently deployable after US1 or alongside it
- **User Story 3 (Phase 5)**: Depends on Phase 2 — verification-only; can run any time after baseline edits but is most meaningful after US1+US2 are applied
- **Polish (Phase 6)**: Depends on all desired user stories being applied

### User Story Dependencies

- **US1 (P1)** — Independent. Touches rows the other stories do not touch.
- **US2 (P2)** — Independent. Inserts a brand-new section; no overlap with US1 edit ranges.
- **US3 (P3)** — Verification-only. Does not modify file state; semantically validates decisions from research.md.

### Within Each User Story

All implementation tasks (T004–T014) target `content/docs/costs.mdx`. Every edit depends on T003 (file read) to establish precise `old_string` arguments. Within a phase, the order of edits doesn't technically matter, but running in table-ordinal order (as listed) produces cleaner diffs.

### Parallel Opportunities

- **Setup**: T001 and T002 can run in parallel (git status and dev server start are independent)
- **Within Phases 3–5**: Strictly no `[P]` markers because every task edits the same file (`content/docs/costs.mdx`). However, the Edit tool can perform multiple distinct `old_string` → `new_string` replacements against the same file in a single message (as long as each `old_string` is unique); this lets a single turn apply several updates while still serializing writes correctly
- **Across stories**: US1 edits (T004–T012) and the US2 insertion (T014) touch disjoint line ranges, so a reviewer can accept them as one bundled commit without ordering hazard
- **Polish**: T019, T020, T021 are read-only sweeps and can be executed/reviewed in parallel

---

## Parallel Example: Applying all US1 edits in one turn

The Edit tool can take multiple non-overlapping `old_string` values in the same conversation turn. Reviewer convenience is higher when all 9 US1 edits land as one cohesive change:

```text
Edit content/docs/costs.mdx — "US$ 0.014" (Inbound row context) → "$0.017"
Edit content/docs/costs.mdx — "US$ 0,1036" → "$0.13125"
Edit content/docs/costs.mdx — "US$ 0,0472 | Atualizações" → "$0.01428 | Atualizações"
Edit content/docs/costs.mdx — "US$ 0,93 / 1000 e-mails" → "$1.35 / 1.000 emails"
Edit content/docs/costs.mdx — "US$ 0,0472 / 1000 validações" → "$5.00 / 1.000 validações"
Edit content/docs/costs.mdx — "US$ 14.00" → "$20.00"
Edit content/docs/costs.mdx — "US$ 0.014" (Gatilhos row context) → "$0.02"
Edit content/docs/costs.mdx — "US$ 1.386" → "$1.98"
Edit content/docs/costs.mdx — "US$ 0.014" (Avaliações row context) → "$0.02"
```

**Note**: The three rows that share the exact literal `US$ 0.014` (Inbound, Gatilhos, Avaliações) MUST use enough surrounding context in their `old_string` to remain unique — Edit will fail if the match is ambiguous.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001, T002)
2. Complete Phase 2 (T003)
3. Complete Phase 3 (T004–T013)
4. **STOP and VALIDATE**: Confirm the nine updated prices match the PDF; deploy/demo as MVP
5. Commit with a message like `docs(costs): sync nine prices to 2026-04 source-of-truth reconciliation`

### Incremental Delivery

1. Setup + Foundational → baseline captured
2. US1 → 9 stale prices fixed → Commit/Deploy/Demo (MVP!)
3. US2 → Content AI section added → Commit/Deploy
4. US3 → Preservation verified (no code changes; verification record kept in PR description)
5. Polish → final sweep + quickstart validation → Merge

### Single-developer sequential strategy (expected for a docs edit)

All three user stories and the polish phase are realistically completed by one person in a single work session:

1. T001–T003 (setup + baseline read)
2. T004–T013 in one Edit turn + reload (US1 MVP)
3. T014–T015 in one Edit turn + reload (US2)
4. T016–T018 read-only verification (US3)
5. T019–T023 polish + quickstart run

---

## Notes

- `[P]` is intentionally absent from Phase 3, 4, and 5 implementation tasks: every edit targets `content/docs/costs.mdx`, so the strict [P] criterion (different files) is not met. Parallelism for this feature happens at the **Edit-tool batching** level, not at the task level.
- Each user story checkpoint is verifiable independently: US1 by comparing 9 rows to the PDF, US2 by looking for the new section, US3 by confirming absence of changes/additions.
- Commit granularity is a judgment call; `specs/001-update-pricing-docs/plan.md` does not mandate one-commit-per-task. Recommend a single commit per completed story.
- The quickstart (T023) is the canonical acceptance gate before merge.
