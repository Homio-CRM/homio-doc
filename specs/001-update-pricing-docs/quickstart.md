# Quickstart: Verify Pricing Documentation Update

**Feature**: 001-update-pricing-docs
**Audience**: Reviewer or developer confirming the feature works as specified.
**Time required**: ~5 minutes.

## Prerequisites

- Repository cloned, working tree on branch `001-update-pricing-docs`
- Node.js toolchain present (any version compatible with the project's `package.json`)
- Dependencies installed: `npm install` (only needed on first run)
- The source-of-truth PDF open in a PDF viewer: `1776433739696-comparativo-completo-custos-homio.pdf` at repo root. Keep page 2 ("Resumo — O que Atualizar na Documentação") visible alongside the browser.

## Steps

### 1. Start the docs site locally

```bash
npm run dev
```

Wait for Next.js to print the local URL (usually `http://localhost:3000`).

### 2. Open the cost page

Navigate to **http://localhost:3000/docs/costs** in a browser.

### 3. Verify the 9 updated prices match the PDF's "Valor Correto" column

Compare row-by-row against the PDF summary table. All values below MUST appear verbatim on the rendered page:

| # | Section on page | Row label | Expected value |
|---|-----------------|-----------|----------------|
| 1 | Telefonia e Ligações | Recebimento (Inbound) | `$0.017` / minuto |
| 2 | Mensagens via WhatsApp | Marketing | `$0.13125` / conversa |
| 3 | Mensagens via WhatsApp | Utilidade | `$0.01428` / conversa |
| 4 | E-mail | Envio | `$1.35` / 1.000 emails |
| 5 | E-mail | Validação | `$5.00` / 1.000 validações |
| 6 | Outros | Compra de Domínio | `$20.00` |
| 7 | Outros | Gatilhos/Ações Premium | `$0.02` / execução |
| 8 | Outros | Criação de Funis (IA) | `$1.98` / funil |
| 9 | Outros | Resposta a Avaliações (IA) | `$0.02` / resposta |

**PASS criterion**: every expected value appears exactly. No `$0.014`, `$0,93`, `$14.00`, `$1.386`, `$0,1036`, `$0,0472`, or `$0.0472/1000` remains visible anywhere on the page.

### 4. Verify the two new Content AI rows exist in a new dedicated section

Confirm that a heading `## IA de Conteúdo (Content AI)` appears between `IA de Conversação` and `IA de Voz`, containing a 2-row table:

| Row | Expected value |
|-----|----------------|
| Texto | `$0.18` / 1.000 palavras |
| Imagem | `$0.12` / imagem |

**PASS criterion**: the section exists in the correct position, both rows are present, no other content is injected.

### 5. Verify preserved rows are unchanged

Scroll through and confirm the following remain exactly as before:

- Aluguel de Número: `US$ 5.95` / Mensal
- Outbound destinations (Celular `$0.0868`, Grandes Cidades `$0.0308`, Geral `$0.056`)
- Gravação / Armazenamento / Transcrição
- Conversation AI token table (Gemini, Claude, GPT-4.1 input/output prices)
- Voice AI engine price (`$0.084`/min) and per-provider token table

**PASS criterion**: none of these cells changed. Agent Studio is absent (not added).

### 6. Check prose for stale references

Search the rendered page (Ctrl+F) for each old value: `0.014`, `0,93`, `14.00`, `1.386`, `0,1036`, `0,0472`. None should appear in callouts, section intros, or footnotes.

**PASS criterion**: zero hits for stale values.

### 7. Check decimal notation consistency

All edited/added cells use a period as decimal separator (`$1.35`, not `$1,35`). Untouched cells outside the scope of this feature may retain whatever notation they already had.

**PASS criterion**: no edited cell uses comma decimals.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Dev server fails to start | `node_modules` missing | `npm install`, then retry |
| Page is 404 | Docs path changed upstream | Check `content/docs/meta.json`; confirm `costs.mdx` is listed |
| Table renders broken (missing columns) | Pipe/dash count mismatch in MDX | Open `content/docs/costs.mdx`, ensure each table row has matching `|` count and separator row has correct dashes |
| Old value still visible | Prose mention was missed | Search `costs.mdx` for the old numeric literal; update the inline prose to match the new value |
| `<Callout>` warning in console | Malformed MDX tag | Verify `<Callout>` / `</Callout>` pairs are balanced and props are valid |

## Success definition

All seven steps pass → the feature meets SC-001 through SC-005 in the spec. The documentation now reflects the source-of-truth PDF exactly. Ready to merge.
