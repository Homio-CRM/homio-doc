import { universidade } from '@/.source';
import { loader, type InferPageType } from 'fumadocs-core/source';
import type { AdvancedIndex } from 'fumadocs-core/search/server';

/** Host público; entra nos links absolutos que o agente envia. */
export const SITE_URL = 'https://docs.homio.com.br';

export const universidadeSource = loader({
  baseUrl: '/universidade',
  source: universidade.toFumadocsSource(),
});

export type TutorialPage = InferPageType<typeof universidadeSource>;
export type Clipe = TutorialPage['data']['clipes'][number];

/** Tutoriais com `publicado: true`, na ordem do campo `ordem`. */
export function tutoriaisPublicados(): TutorialPage[] {
  return universidadeSource
    .getPages()
    .filter((p) => p.data.publicado !== false)
    .sort(
      (a, b) =>
        a.data.ordem - b.data.ordem ||
        a.data.title.localeCompare(b.data.title, 'pt-BR'),
    );
}

export function tutorialPorSlug(slug: string): TutorialPage | undefined {
  const page = universidadeSource.getPage([slug]);
  if (!page || page.data.publicado === false) return undefined;
  return page;
}

/** Agrupa por tema preservando a ordem dos tutoriais. */
export function tutoriaisPorTema(): Map<string, TutorialPage[]> {
  const mapa = new Map<string, TutorialPage[]>();
  for (const p of tutoriaisPublicados()) {
    const lista = mapa.get(p.data.tema) ?? [];
    lista.push(p);
    mapa.set(p.data.tema, lista);
  }
  return mapa;
}

export function clipePrincipal(page: TutorialPage): Clipe {
  return page.data.clipes.find((c) => c.tipo === 'principal') ?? page.data.clipes[0];
}

export function problemasComuns(page: TutorialPage): Clipe[] {
  return page.data.clipes.filter((c) => c.tipo !== 'principal');
}

/** URL do trecho. O clipe principal é a própria página; os outros levam `#ancora`. */
export function urlClipe(page: TutorialPage, clipe: Clipe, absoluta = false): string {
  const base = absoluta ? `${SITE_URL}${page.url}` : page.url;
  return clipe.tipo === 'principal' ? base : `${base}#${clipe.ancora}`;
}

/** A resposta pronta pro agente, com `{link}` trocado pela URL absoluta do trecho. */
export function respostaComLink(page: TutorialPage, clipe: Clipe): string {
  return clipe.resposta.replaceAll('{link}', urlClipe(page, clipe, true));
}

/** A mesma resposta, sem o "Veja: {link}" do fim, pra exibir na página. */
export function respostaSemLink(clipe: Clipe): string {
  return clipe.resposta
    .replace(/\s*Veja:\s*\{link\}\.?\s*$/u, '')
    .replaceAll('{link}', '')
    .trim();
}

export interface Destaque {
  page: TutorialPage;
  clipe: Clipe;
}

/**
 * Faixa "Os problemas mais enviados" do índice: os clipes com `suporte_rank`, na
 * ordem da lista de 25 da análise de suporte (empate: ordem do tutorial, depois a
 * ordem do clipe dentro dele). Novo tutorial entra na faixa só marcando o campo.
 */
export function maisEnviados(limite = 8): Destaque[] {
  const lista: Destaque[] = [];
  for (const page of tutoriaisPublicados()) {
    for (const clipe of page.data.clipes) {
      if (clipe.suporte_rank) lista.push({ page, clipe });
    }
  }
  return lista
    .sort(
      (a, b) =>
        (a.clipe.suporte_rank ?? 0) - (b.clipe.suporte_rank ?? 0) ||
        a.page.data.ordem - b.page.data.ordem,
    )
    .slice(0, limite);
}

export function duracaoTotal(page: TutorialPage): number {
  return page.data.clipes.reduce((soma, c) => soma + (c.duracao ?? 0), 0);
}

export function formatarDuracao(segundos?: number): string {
  if (!segundos) return '';
  if (segundos < 60) return `${segundos} s`;
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return s ? `${m} min ${s} s` : `${m} min`;
}

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function idTema(tema: string): string {
  return `tema-${normalizar(tema).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

// ---------------------------------------------------------------------------
// Busca por sintoma (API do agente)
// ---------------------------------------------------------------------------

const PARADAS = new Set([
  'de', 'do', 'da', 'dos', 'das', 'o', 'a', 'os', 'as', 'e', 'ou', 'que', 'meu', 'minha',
  'meus', 'minhas', 'nao', 'no', 'na', 'nos', 'nas', 'um', 'uma', 'com', 'para', 'pra',
  'por', 'em', 'se', 'ta', 'esta', 'estao', 'como', 'faco', 'fazer', 'ser', 'ja', 'mais',
  'so', 'ao', 'aos', 'ele', 'ela', 'eu', 'voce', 'isso', 'aqui', 'ai', 'la', 'ne', 'oi',
  'ola', 'bom', 'dia', 'tarde', 'noite', 'por', 'favor', 'me', 'te', 'tem', 'ter', 'esse',
  'essa', 'este', 'deu', 'da', 'quando', 'onde', 'qual', 'homio', 'sistema', 'plataforma',
]);

/** Sufixos tirados pra "desconectou" casar com "desconectado"; mínimo de 4 letras no radical. */
const SUFIXOS = [
  'aram', 'eram', 'iram', 'ando', 'endo', 'indo', 'ados', 'idos', 'ada', 'ida', 'ado',
  'ido', 'ava', 'ou', 'ram', 'am', 'em', 'ar', 'er', 'ir', 'ns', 's',
];

function radical(t: string): string {
  for (const suf of SUFIXOS) {
    if (t.length - suf.length >= 4 && t.endsWith(suf)) return t.slice(0, -suf.length);
  }
  return t;
}

export function termos(texto: string): string[] {
  return normalizar(texto)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !PARADAS.has(t))
    .map(radical);
}

/**
 * Dois radicais casam se forem iguais ou se um for o outro com no máximo uma letra
 * a mais ("funi"/"funil", "mensag"/"mensage"). Mais folga que isso faz "conta"
 * casar com "contato".
 */
function casa(a: string, b: string): boolean {
  if (a === b) return true;
  const [curto, longo] = a.length <= b.length ? [a, b] : [b, a];
  if (curto.length < 4 || longo.length - curto.length > 1) return false;
  return longo.startsWith(curto);
}

/** Soma `peso` por termo da consulta presente no campo e marca quais termos casaram. */
function pontuar(
  consulta: string[],
  campo: string[],
  peso: number,
  casados: Set<string>,
): number {
  let pontos = 0;
  for (const q of consulta) {
    if (campo.some((c) => casa(q, c))) {
      pontos += peso;
      casados.add(q);
    }
  }
  return pontos;
}

/** Abaixo disso o trecho não responde à dúvida; melhor devolver nada que ruído. */
const PONTUACAO_MINIMA = 8;
const COBERTURA_MINIMA = 0.5;

export interface ClipeResultado {
  tutorial: string;
  tutorial_slug: string;
  tema: string;
  titulo: string;
  pergunta?: string;
  ancora: string;
  tipo: Clipe['tipo'];
  url: string;
  mp4?: string;
  capa?: string;
  duracao_s?: number;
  narrado: boolean;
  /** pronta pra mandar: já contém o link do trecho */
  resposta: string;
  passos: string[];
}

export function paraResultado(page: TutorialPage, clipe: Clipe): ClipeResultado {
  return {
    tutorial: page.data.title,
    tutorial_slug: page.slugs[0] ?? '',
    tema: page.data.tema,
    titulo: clipe.titulo,
    pergunta: clipe.pergunta,
    ancora: clipe.ancora,
    tipo: clipe.tipo,
    url: urlClipe(page, clipe, true),
    mp4: clipe.mp4,
    capa: clipe.capa,
    duracao_s: clipe.duracao,
    narrado: clipe.narrado,
    resposta: respostaComLink(page, clipe),
    passos: clipe.legendas,
  };
}

export type ClipeEncontrado = ClipeResultado & {
  pontuacao: number;
  /** alta: manda direto; media: confirme com o cliente antes */
  confianca: 'alta' | 'media';
};

/**
 * Procura o trecho que responde à dúvida. Sintoma vale 5, título/pergunta 3,
 * resposta/legendas 1. Só entra quem passa da pontuação mínima e cobre ao menos
 * metade dos termos da consulta. Empate: o clipe mais curto (mais específico) primeiro.
 */
export function buscarClipes(consulta: string, limite = 5): ClipeEncontrado[] {
  const q = [...new Set(termos(consulta))];
  if (q.length === 0) return [];
  const achados: ClipeEncontrado[] = [];
  for (const page of tutoriaisPublicados()) {
    for (const c of page.data.clipes) {
      const casados = new Set<string>();
      const sintomas = c.sintomas.flatMap(termos);
      const titulos = termos(`${c.titulo} ${c.pergunta ?? ''} ${page.data.title}`);
      const corpo = termos(`${c.resposta} ${c.legendas.join(' ')} ${c.texto ?? ''}`);
      const pontuacao =
        pontuar(q, sintomas, 5, casados) +
        pontuar(q, titulos, 3, casados) +
        pontuar(q, corpo, 1, casados);
      const cobertura = casados.size / q.length;
      if (pontuacao < PONTUACAO_MINIMA || cobertura < COBERTURA_MINIMA) continue;
      achados.push({
        ...paraResultado(page, c),
        pontuacao,
        confianca: pontuacao >= 15 && cobertura >= 0.66 ? 'alta' : 'media',
      });
    }
  }
  return achados
    .sort(
      (a, b) =>
        b.pontuacao - a.pontuacao ||
        (a.duracao_s ?? 999) - (b.duracao_s ?? 999),
    )
    .slice(0, limite);
}

/** Catálogo completo, pra quem quer listar em vez de buscar. */
export function catalogo() {
  return tutoriaisPublicados().map((p) => ({
    slug: p.slugs[0] ?? '',
    titulo: p.data.title,
    descricao: p.data.description,
    tema: p.data.tema,
    url: `${SITE_URL}${p.url}`,
    duracao_total_s: duracaoTotal(p),
    clipes: p.data.clipes.map((c) => paraResultado(p, c)),
  }));
}

// ---------------------------------------------------------------------------
// Busca do site e texto pro assistente de IA
// ---------------------------------------------------------------------------

export function indiceBuscaTutorial(page: TutorialPage): AdvancedIndex {
  const principal = clipePrincipal(page);
  const problemas = problemasComuns(page);
  return {
    id: page.url,
    title: page.data.title,
    description: page.data.description,
    url: page.url,
    breadcrumbs: ['Universidade', page.data.tema],
    structuredData: {
      headings: problemas.map((c) => ({ id: c.ancora, content: c.titulo })),
      contents: [
        {
          heading: undefined,
          content: [
            page.data.description,
            principal.pergunta,
            ...principal.legendas,
            principal.sintomas.join(', '),
          ]
            .filter(Boolean)
            .join(' '),
        },
        ...problemas.map((c) => ({
          heading: c.ancora,
          content: [c.pergunta, respostaSemLink(c), ...c.legendas, c.sintomas.join(', ')]
            .filter(Boolean)
            .join(' '),
        })),
      ],
    },
  };
}

/** Markdown de um tutorial pro assistente de IA e pros arquivos llms. */
export function textoTutorialParaLLM(page: TutorialPage): string {
  const principal = clipePrincipal(page);
  const linhas: string[] = [
    `# ${page.data.title} (${SITE_URL}${page.url})`,
    '',
    page.data.description ?? '',
    '',
    `Tutorial em vídeo da Universidade Homio. Tema: ${page.data.tema}.`,
    '',
    `## Vídeo principal: ${principal.titulo}${principal.duracao ? ` (${formatarDuracao(principal.duracao)})` : ''}`,
    `Link: ${urlClipe(page, principal, true)}`,
    ...principal.legendas.map((l, i) => `${i + 1}. ${l}`),
    '',
    '## Problemas comuns (um vídeo curto por situação)',
  ];
  for (const c of problemasComuns(page)) {
    linhas.push(
      `- **${c.titulo}**${c.duracao ? ` (${formatarDuracao(c.duracao)})` : ''}. Link do trecho: ${urlClipe(page, c, true)}`,
    );
    linhas.push(`  ${respostaSemLink(c)}`);
  }
  return linhas.join('\n');
}

export function textoUniversidadeParaLLM(): string {
  const paginas = tutoriaisPublicados();
  if (paginas.length === 0) return '';
  return [
    `# Universidade Homio: tutoriais em vídeo (${SITE_URL}/universidade)`,
    '',
    'Quando a dúvida tiver um trecho de vídeo correspondente, inclua o link do trecho na resposta.',
    '',
    ...paginas.map(textoTutorialParaLLM),
  ].join('\n\n');
}
