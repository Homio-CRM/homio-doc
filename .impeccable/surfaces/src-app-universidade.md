---
version: 1
slug: "src-app-universidade"
primary_target: "src/app/universidade"
related_targets: ["src/app/universidade/[slug]"]
---

# Universidade Homio (src/app/universidade)

Escopo: extensão da central de ajuda `docs.homio.com.br` (Fumadocs). Modo: Read.
Audiência: cliente da Homio com um problema, vindo de um link do suporte pelo WhatsApp (celular), ou navegando pelo menu da documentação. Segundo leitor: a equipe de suporte, que copia o link do trecho.
Tarefa: achar e assistir o trecho certo; copiar o link do trecho.
Conteúdo: catálogo em MDX (`content/universidade/*.mdx`, frontmatter com clipes, âncoras, legendas, resposta pronta, sintomas); vídeos e capas na Media Storage da subconta Homio.
Restrições: `noindex`; sem login; sem autoplay com som; pt-BR; "Homio", nunca o nome da plataforma de origem; copy sem travessão.
Não decidido: medição de acesso por link enviado; menu dentro da Homio com SSO.

## Direction contract

THESIS: a página é uma lista de problemas com a solução em vídeo, não um curso. A unidade é o trecho (âncora) e o link de cada trecho é objeto de primeira classe (botão Copiar link). Recusa o arranjo "player gigante com playlist ao lado".
OWN-WORLD: o sistema do Fumadocs já em uso (tokens `fd-*`, tema ocean, Geist, sidebar à esquerda e TOC "clerk" à direita). Vídeo em moldura preta de cantos arredondados com borda `fd-border`; chips de problema em pílula; capas reais das gravações como imagem. Sem gradiente, sombra ou cor nova.
STORY: "meu WhatsApp caiu" chega em `#reconectar`, vê a faixa laranja no vídeo e resolve; abaixo descobre os outros casos e, se quiser, o caminho completo no topo.
FIRST VIEWPORT (desktop 1440): sidebar com os tutoriais por tema; título e descrição; vídeo principal 16:9 na coluna de leitura com duração e estado da narração na legenda; TOC à direita listando cada problema comum. Mobile 390: título, vídeo, lista de problemas. Ação primária: play.
FORM: extensão de superfície existente (new-work §3 "Extend an existing surface"); sem rodada de conceito e sem seed.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
