# Data Model: Update Pricing Documentation to Match Source of Truth

**Feature**: 001-update-pricing-docs
**Date**: 2026-04-17

## Overview

This feature has no database, no runtime data, and no API schemas. The relevant "entities" are the documents involved in the reconciliation: the MDX page being edited, the source-of-truth PDF driving the edit, and the logical structure of priced items within the MDX page. This document captures those entities so the feature's structure is explicit for reviewers and downstream tasks.

## Entities

### Cost Documentation Page

- **Location**: `content/docs/costs.mdx`
- **Purpose**: Single public-facing page that lists every usage-based cost customers are billed for.
- **Format**: MDX (Markdown + JSX) rendered by Fumadocs at route `/docs/costs`.
- **Frontmatter**:
  - `title: Custos de Uso`
  - `description: Entenda as tarifas para ligações, WhatsApp, E-mail e Inteligência Artificial no Homio`
  - `icon: CreditCard`
- **Section layout (after this feature)**:

  | # | Heading | Content | Scope for this feature |
  |---|---------|---------|------------------------|
  | 1 | `## Telefonia e Ligações` | 3 tables: Aluguel + Inbound; Outbound destinations; Gravação/Armazenamento/Transcrição | **Inbound row updated**; everything else preserved |
  | 2 | `## Mensagens via WhatsApp` | 1 table: Marketing, Utilidade | **Both rows updated** |
  | 3 | `## E-mail` | 1 table: Envio, Validação | **Both rows updated** |
  | 4 | `## Outros` | 1 table: Domínio, Gatilhos, Funis IA, Avaliações IA | **All 4 rows updated** |
  | 5 | `## IA de Conversação (Conversation AI)` | Token pricing table by provider | Preserved |
  | 6 | `## IA de Conteúdo (Content AI)` **← new** | 1 table: Texto, Imagem | **New section inserted** |
  | 7 | `## IA de Voz (Voice AI)` | Engine price + per-provider token table | Preserved |

### Source-of-Truth Document

- **Location**: `1776433739696-comparativo-completo-custos-homio.pdf` (repo root)
- **Date**: 2026-04-08
- **Purpose**: Reconciled price list produced from three sources (current docs, rebilling platform, user-reported). Its "Valor Correto" column is the canonical value for every item in scope.
- **Relevant section**: "Resumo — O que Atualizar na Documentação" (page 2) — the authoritative summary table.

### Priced Item

A logical row inside a table in the Cost Documentation Page. Each Priced Item has:

| Attribute | Description | Example |
|-----------|-------------|---------|
| `label` | Customer-facing service name (Portuguese) | `Validação de E-mail` |
| `value` | Numeric price with unit | `$5.00/1.000 validações` |
| `unit_basis` | How the price is quantized | per-1000 / per-unit / monthly / per-execution |
| `section` | Which `##` heading the row belongs to | `E-mail` |
| `change_type` | What this feature does to the row | `update` \| `add` \| `preserve` |
| `source_of_truth_row` | Corresponding row in the PDF summary table | `Validação de E-mail` |

### Price Update Mapping

The concrete set of Priced Item transformations this feature performs. This is the complete list — no other rows change.

| # | Section | Label | Current value | New value | Change type |
|---|---------|-------|---------------|-----------|-------------|
| 1 | Telefonia e Ligações | Recebimento (Inbound) | `US$ 0.014` / min | `$0.017` / min | update |
| 2 | Mensagens via WhatsApp | Marketing | `US$ 0,1036` / conversa | `$0.13125` / conversa | update |
| 3 | Mensagens via WhatsApp | Utilidade | `US$ 0,0472` / conversa | `$0.01428` / conversa | update |
| 4 | E-mail | Envio | `US$ 0,93` / 1000 e-mails | `$1.35` / 1.000 emails | update |
| 5 | E-mail | Validação | `US$ 0,0472` / 1000 validações | `$5.00` / 1.000 validações | update |
| 6 | Outros | Compra de Domínio | `US$ 14.00` | `$20.00` | update |
| 7 | Outros | Gatilhos/Ações Premium | `US$ 0.014` / execução | `$0.02` / execução | update |
| 8 | Outros | Criação de Funis (IA) | `US$ 1.386` / funil | `$1.98` / funil | update |
| 9 | Outros | Resposta a Avaliações (IA) | `US$ 0.014` / resposta | `$0.02` / resposta | update |
| 10 | IA de Conteúdo (Content AI) *(new section)* | Texto | — | `$0.18` / 1.000 palavras | add |
| 11 | IA de Conteúdo (Content AI) *(new section)* | Imagem | — | `$0.12` / imagem | add |

**Totals**: 9 updates + 2 additions = 11 Priced Item transformations. Matches SC-001 in the spec.

## Validation Rules

1. Every `update` row above MUST replace the current value with the new value in `content/docs/costs.mdx`. The old value MUST NOT remain anywhere in the file (including prose/callouts).
2. Every `add` row MUST appear in the new `## IA de Conteúdo (Content AI)` section, which MUST be positioned between `## IA de Conversação` and `## IA de Voz`.
3. Every row NOT in this table MUST remain byte-for-byte unchanged.
4. All new/updated values MUST use US decimal notation (period separator); no comma decimals in edited cells.
5. The MDX file MUST parse cleanly (valid tables, matching `<Callout>` tags, unchanged frontmatter).

## State Transitions

N/A — static content, no lifecycle.

## Relationships

- Source-of-Truth Document → (1..N) Priced Item entries in its "Valor Correto" summary table
- Priced Item → (1) row in the Cost Documentation Page
- Cost Documentation Page → (0..N) sections; each section → (1..N) Priced Items
