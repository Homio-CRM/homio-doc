# Feature Specification: Update Pricing Documentation to Match Source of Truth

**Feature Branch**: `001-update-pricing-docs`
**Created**: 2026-04-17
**Status**: Draft
**Input**: User description: "our goal here is pretty simple, we want to the princing in the file 1776433739696-comparativo-completo-custos-homio and change all the prices contained in this documentation to match it, this file is a source of truth"

## Clarifications

### Session 2026-04-17

- Q: Where should the two new Content AI rows be placed in the documentation? → A: New dedicated section `## IA de Conteúdo (Content AI)` inserted between `## IA de Conversação` and `## IA de Voz`, containing a 2-row table (Texto `$0.18/1.000 palavras`, Imagem `$0.12/imagem`).
- Q: Should the `$0.028/min` rebilling reference for outbound calls be added alongside the Brazilian destination tariffs? → A: No — keep only the three Brazilian destination tariffs (Celular `$0.0868`, Grandes Cidades `$0.0308`, Geral `$0.056`). The `$0.028/min` figure is a US/Twilio platform default that does not apply to BR outbound and would confuse customer-facing readers.
- Q: How should the Validação de E-mail price be displayed? → A: `$5.00/1.000 validações` (per-thousand format), matching the sibling E-mail envio row and preserving the existing table's visual consistency.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Align All Outdated Prices With Source of Truth (Priority: P1)

A reader visiting the public cost documentation needs to see prices that match what is actually billed to customers. The source-of-truth comparison document (`1776433739696-comparativo-completo-custos-homio.pdf`) lists the current, correct values for every item. All outdated entries in the documentation must be updated to those values so the reader never encounters a stale price.

**Why this priority**: Customers and prospects rely on the docs to understand what they will pay. A single incorrect price erodes trust and creates billing disputes. This is the entire point of the feature — without it, the rest does not matter.

**Independent Test**: Open the cost documentation, compare each row against the source-of-truth table, and confirm every listed value matches the "Valor Correto" column. Can be fully verified by visual/manual comparison with the PDF.

**Acceptance Scenarios**:

1. **Given** the source-of-truth PDF lists E-mail envio at `$1.35/1.000 emails`, **When** a reader opens the cost documentation, **Then** the E-mail envio row shows `$1.35/1.000 emails` (not the previous `$0,93`).
2. **Given** the source-of-truth PDF lists Validação de E-mail at `$0.005/verificação` (= `$5.00/1.000`), **When** a reader opens the cost documentation, **Then** the validation row shows `$5.00/1.000` (not `$0,0472/1.000`).
3. **Given** the source-of-truth PDF lists Gatilhos/Ações Premium at `$0.02/execução`, **When** a reader opens the cost documentation, **Then** the row shows `$0.02` (not `$0.014`).
4. **Given** the source-of-truth PDF lists Recebimento (Inbound) at `$0.017/min`, **When** a reader opens the cost documentation, **Then** the row shows `$0.017/min` (not `$0.014/min`).
5. **Given** the source-of-truth PDF lists Resposta a Avaliações (IA) at `$0.02/resposta`, **When** a reader opens the cost documentation, **Then** the row shows `$0.02` (not `$0.014`).
6. **Given** the source-of-truth PDF lists Compra de Domínio at `$20.00`, **When** a reader opens the cost documentation, **Then** the row shows `$20.00` (not `$14.00`).
7. **Given** the source-of-truth PDF lists Criação de Funis (IA) at `$1.98/funil`, **When** a reader opens the cost documentation, **Then** the row shows `$1.98` (not `$1.386`).
8. **Given** the source-of-truth PDF lists WhatsApp Marketing at `$0.13125/conversa` and Utilidade at `$0.01428/conversa`, **When** a reader opens the cost documentation, **Then** those rows show the updated values (not `$0,1036` and `$0,0472`).

---

### User Story 2 - Add Missing Services to the Documentation (Priority: P2)

Two services that customers are billed for today — Content AI (Texto) and Content AI (Imagem) — do not appear in the public cost documentation at all. These need to be added so readers see every chargeable item in one place.

**Why this priority**: Missing entries are arguably worse than stale ones because the reader has no signal that a cost even exists. Critical for accuracy, but slightly behind P1 because no existing row is wrong — it is an omission.

**Independent Test**: Open the cost documentation, search for "Content AI", confirm two rows exist with the correct prices (`$0.18/1.000 palavras` for texto, `$0.12/imagem` for imagem).

**Acceptance Scenarios**:

1. **Given** the source-of-truth PDF lists Content AI — Texto at `$0.18/1.000 palavras`, **When** a reader opens the cost documentation, **Then** a row for Content AI — Texto is present with that value.
2. **Given** the source-of-truth PDF lists Content AI — Imagem at `$0.12/imagem`, **When** a reader opens the cost documentation, **Then** a row for Content AI — Imagem is present with that value.

---

### User Story 3 - Preserve Items Flagged as "Double Check" Without False Precision (Priority: P3)

The source-of-truth PDF flags three items that are not fully settled: WhatsApp Marketing/Utilidade (user-reported values need GHL confirmation), Ligações Outbound (PDF note recommends keeping both the destination-tiered tariffs and the `$0.028/min` reference), and Agent Studio (only reported by user, not yet confirmed in rebilling). The documentation update must handle these deliberately rather than silently committing to one value.

**Why this priority**: P3 because it affects only three rows and the defaults (use new value for WhatsApp, keep destination tariffs for outbound, exclude Agent Studio until confirmed) are reasonable. The feature still ships if these are handled well.

**Independent Test**: Verify WhatsApp Marketing and Utilidade show the new values; verify Ligações Outbound keeps the three-destination table (Celular, Grandes Cidades, Geral); verify Agent Studio is absent from the docs until confirmed.

**Acceptance Scenarios**:

1. **Given** the PDF notes Ligações Outbound has both a `$0.028/min` reference and three Brazilian destination tariffs, **When** a reader opens the cost documentation, **Then** the three-destination tariff table (Celular `$0.0868`, Grandes Cidades `$0.0308`, Geral `$0.056`) is preserved (these remain the source-of-truth prices for Brazilian outbound).
2. **Given** the PDF marks Agent Studio as "INCLUIR após confirmar", **When** a reader opens the cost documentation, **Then** Agent Studio is **not** added yet (pending confirmation).
3. **Given** WhatsApp values are flagged "(confirmar)" in the PDF, **When** the documentation is updated, **Then** the new values (`$0.13125` and `$0.01428`) are used — the PDF explicitly states the user-informed values are more precise and should replace the doc values.

---

### Edge Cases

- **Number format consistency**: The current doc mixes Brazilian decimal (`$ 0,1036`) and US decimal (`$ 0.014`) notation. All updated prices must use a single, consistent format throughout the cost document — US decimal (period separator) — because the source-of-truth PDF uses that format.
- **Pricing referenced from other docs**: Only `content/docs/costs.mdx` contains priced figures (verified by grep). Other docs mention "custo" or "preço" conceptually but do not list numeric values, so no cross-file price edits are required.
- **Prices not in the source-of-truth PDF**: The current doc lists several items not covered by the PDF (phone number rental `$5.95/mês`, recording/storage/transcription, Conversation AI per-provider token pricing, Voice AI engine + per-provider token pricing). These are out of scope — they stay exactly as they are.
- **Callouts and narrative text**: Any inline price mention in surrounding prose (e.g., callouts, section intros) must be updated to match the new tabular values, or rewritten to not repeat the number.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The cost documentation MUST display the following updated prices exactly as listed in the source-of-truth PDF "Resumo — O que Atualizar na Documentação" table:
  - E-mail (envio): `$1.35/1.000 emails` (replacing `$0,93/1000 e-mails`)
  - Validação de E-mail: `$5.00/1.000 validações` (replacing `$0,0472/1000 validações`) — per-thousand format selected to match the sibling E-mail envio row
  - Gatilhos/Ações Premium: `$0.02` por execução (replacing `$0.014`)
  - Recebimento (Inbound): `$0.017/minuto` (replacing `$0.014`)
  - Resposta a Avaliações (IA): `$0.02` por resposta (replacing `$0.014`)
  - Compra de Domínio: `$20.00` (replacing `$14.00`)
  - Criação de Funis (IA): `$1.98/funil` (replacing `$1.386`)
  - WhatsApp — Marketing: `$0.13125/conversa` (replacing `$0,1036`)
  - WhatsApp — Utilidade: `$0.01428/conversa` (replacing `$0,0472`)
- **FR-002**: The cost documentation MUST include new entries for services that were previously missing, placed in a new dedicated section `## IA de Conteúdo (Content AI)` inserted between `## IA de Conversação` and `## IA de Voz`:
  - Content AI — Texto: `$0.18/1.000 palavras`
  - Content AI — Imagem: `$0.12/imagem`
- **FR-003**: The cost documentation MUST preserve items that the PDF does not update: phone number rental, outbound call destination tariffs (Celular/Grandes Cidades/Geral), recording/storage/transcription, Conversation AI token tables, and Voice AI engine and token tables.
- **FR-004**: The cost documentation MUST NOT introduce Agent Studio as a billable item in this change (PDF flags it as pending confirmation).
- **FR-005**: All updated numeric values MUST use consistent decimal notation (period as decimal separator) to match the source-of-truth PDF.
- **FR-006**: Surrounding prose, callouts, and any other textual mention of these prices MUST match the new values — no figure may remain stale anywhere in the file.
- **FR-007**: The documentation structure (section ordering, tables, callouts, headings) MUST remain unchanged except where a new row is added for a newly-included service.

### Key Entities

- **Cost Documentation Page**: The single file `content/docs/costs.mdx` that presents all usage-based costs to customers. Organized into sections (Telefonia, WhatsApp, E-mail, Outros, IA de Conversação, IA de Voz), each containing one or more markdown tables of service/price pairs.
- **Source-of-Truth Document**: The PDF `1776433739696-comparativo-completo-custos-homio.pdf` dated 2026-04-08, which compares the current documentation, the rebilling platform, and user-reported values, and produces a reconciled "Valor Correto" column used as the authoritative price list for this update.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 11 rows listed in the PDF's "Resumo — O que Atualizar na Documentação" table are reflected correctly in the cost documentation (9 updates + 2 new inclusions).
- **SC-002**: A side-by-side manual review of the cost documentation against the PDF's "Valor Correto" column finds zero mismatches.
- **SC-003**: No pricing figure from the current documentation that the PDF flagged as "DOC DESATUALIZADA" remains in the cost documentation after the update.
- **SC-004**: A reader can find pricing for Content AI (Texto and Imagem) in the cost documentation — previously absent, now present.
- **SC-005**: Items outside the PDF's scope (phone rental, outbound tariffs, recording, Conversation AI tables, Voice AI tables) remain byte-for-byte unchanged except where the PDF explicitly updated them.

## Assumptions

- The PDF `1776433739696-comparativo-completo-custos-homio.pdf` dated 2026-04-08 is the definitive source of truth for this change, overriding any conflicting values in `content/docs/costs.mdx`.
- The WhatsApp values flagged "(confirmar)" in the PDF are still applied directly — the PDF's own analysis states the user-informed values ($0.13125 / $0.01428) are more precise than the platform's undifferentiated $0.148 and should replace the doc values.
- Agent Studio is explicitly excluded from this change because the PDF marks it "INCLUIR após confirmar" and no confirmation has been provided.
- Ligações Outbound destination-tiered tariffs in the current doc (Celular/Grandes Cidades/Geral) remain the source-of-truth prices for Brazilian outbound. The `$0.028/min` rebilling reference from the PDF is explicitly excluded from the documentation (clarification Q2): it is a US/Twilio platform default that does not apply to BR outbound and would confuse customer-facing readers.
- No other file in the repository contains numeric pricing that needs to be updated — verified by content search across `content/docs/*.mdx`.
- Decimal format is normalized to US notation (period) because the source-of-truth PDF uses that format.
