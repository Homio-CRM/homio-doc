# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Cliente da Homio** (dono ou usuário de uma subconta do CRM): PME brasileira que vende pelo WhatsApp e usa a Homio para conversas, funil e automação. Chega à documentação quando algo travou (WhatsApp desconectou, lead "sumiu", automação não disparou) ou quando quer aprender uma função. Muitas vezes está no celular, vindo de um link que o suporte mandou pelo WhatsApp.
- **Equipe de suporte da Homio** e o **agente de IA de suporte** (Homio AI Agent): usam o conteúdo para responder com texto curto mais o link do trecho exato. [inferido do wiki: análise de 12 meses de suporte, 2026-10-16]

## Product Purpose

`docs.homio.com.br` é a central de ajuda da Homio: documentação em texto por módulo (WhatsApp, contatos, oportunidades, automações, e-mail, custos) com busca, assistente de IA e formulário de suporte. A **Universidade Homio** é a camada de vídeo dessa central: tutoriais curtos gravados na própria interface, um por tarefa, com o caminho feliz no topo e um clipe por problema comum, cada um com âncora própria. Sucesso = o cliente resolve sozinho e o suporte deixa de repetir a mesma explicação.

## Positioning

Os vídeos são gravados por roteiro em código na interface real da Homio (cursor, destaque e legenda embutidos), com narração na voz do Luan. Mostram a tela exata que o cliente vê, com os rótulos em português da Homio, e não a interface genérica da plataforma de origem. A pauta vem dos dados de suporte: os erros que mais geram ticket ganham clipe próprio. [inferido do wiki]

## Operating Context

- Cliente recebe o link pelo WhatsApp durante um problema; o link precisa abrir sem login e cair no trecho certo.
- O agente de IA consulta o catálogo por sintoma ("desconectou", "triângulo vermelho") e manda texto + link, ou o mp4 (abaixo de 16 MB).
- Vídeos hospedados na Media Storage da subconta Homio (CDN público); catálogo em MDX neste repositório.
- Idioma: português do Brasil. Marca: "Homio", nunca o nome da plataforma de origem.

## Capabilities and Constraints

- Tutoriais prontos em 2026-10-23: **WhatsApp Homio** (conectar, excluir e recriar, reconectar, mensagem com erro; narrados) e **Cadê meu lead** (principal narrado; quatro clipes de erro ainda sem narração).
- Mapeados, ainda sem vídeo: checklist de automação, filtros de contatos, achar conversa, status da oportunidade.
- Páginas da Universidade saem com `noindex` por decisão do Luan (2026-10-23): o link funciona, mas não é divulgado pelo Google.
- Login não é exigido; a única identidade confiável do cliente é a sessão dentro da Homio (SSO), prevista para quando a Universidade entrar no menu do CRM.
- Formato do vídeo: 1920×1080, mp4 H.264, 20 a 90 s por clipe, legenda embutida.
- Em aberto: medição de acesso por link enviado (tabela própria), integração com o agente (só esqueleto por enquanto).

## Brand Commitments

- Nome "Homio"; logos em `public/` (`logo-completo-horizontal-grafite.png`, `simbolo-*.png`).
- Voz: segunda pessoa, frase curta, uma ideia por frase, rótulos de tela como aparecem na Homio. Sem "clique aqui".
- Copy sem travessão (regra da casa). [inferido do site novo]

## Evidence on Hand

- Vídeos finais e capas: `C:\Users\Luan Paganucci\homio-tutoriais\saida\` (e `finais/`), já publicados na Media Storage da subconta Homio (pasta `universidade-homio`).
- Roteiros com legendas, âncoras e "resposta do agente por âncora": `homio-tutoriais/roteiros/01_whatsapp_homio.md`, `07_cade_meu_lead.md`.
- Dados de suporte (12 meses, 2.861 episódios): wiki `homio_suporte_duvidas_frequentes`.
- Não existem depoimentos, números de satisfação ou métricas de uso da documentação; não inventar.

## Product Principles

1. O trecho certo em um toque: toda resposta de suporte aponta para uma âncora, não para "o vídeo".
2. Erro vale mais que caminho feliz: os problemas comuns ficam visíveis, não escondidos atrás de um menu.
3. Tela real, rótulo real: o que aparece no vídeo é o que o cliente vê na Homio.
4. Sem atrito: abre no celular, sem login, sem autoplay com som, sem peso desnecessário.
5. Uma fonte: o mesmo catálogo serve página, busca, assistente de IA e agente de suporte.

## Accessibility & Inclusion

Legendas embutidas em todos os vídeos (texto na tela); transcrição em texto na página para quem não pode ouvir ou assistir. Contraste e foco de teclado herdados do sistema da documentação.
