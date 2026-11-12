import { universidade } from '@/.source';
import { loader, type InferPageType } from 'fumadocs-core/source';
import type { AdvancedIndex } from 'fumadocs-core/search/server';
import { EM_PRODUCAO, type TutorialEmProducao } from '@/lib/universidade-producao';

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

/**
 * Jeitos de falar que viram a palavra do catálogo antes de comparar. É vocabulário
 * de conversa ("zap", "caiu"), não assunto: sintoma novo de um trecho vai no
 * `sintomas` do MDX, não aqui.
 */
const SINONIMOS: Record<string, string> = {
  whats: 'whatsapp',
  whatsap: 'whatsapp',
  wpp: 'whatsapp',
  zap: 'whatsapp',
  zapzap: 'whatsapp',
  caiu: 'desconectou',
  cai: 'desconectou',
  caindo: 'desconectou',
  deslogou: 'desconectou',
  mandar: 'enviar',
  mando: 'enviar',
  manda: 'enviar',
  mandou: 'enviar',
  mandando: 'enviar',
};

export function termos(texto: string): string[] {
  return normalizar(texto)
    .split(/[^a-z0-9]+/)
    .map((t) => SINONIMOS[t] ?? t)
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
  if (longo.startsWith(curto)) return true;
  // erro de digitação: uma letra trocada, a mais ou a menos, só em palavra longa
  // ("watsapp", "desconetou"); em palavra curta isso junta assuntos diferentes
  return curto.length >= 6 && umaEdicao(curto, longo);
}

/** `curto` e `longo` diferem em no máximo uma letra (troca, sobra ou falta). */
function umaEdicao(curto: string, longo: string): boolean {
  let i = 0;
  while (i < curto.length && curto[i] === longo[i]) i++;
  const resto = curto.length === longo.length ? i + 1 : i;
  return curto.slice(resto) === longo.slice(i + 1);
}

/** Soma `peso` por termo da consulta presente no campo e marca quais termos casaram. */
function pontuar(
  consulta: string[],
  campo: string[],
  peso: number,
  casados: Set<string>,
  igual: (q: string, c: string) => boolean = casa,
): number {
  let pontos = 0;
  for (const q of consulta) {
    if (campo.some((c) => igual(q, c))) {
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

export interface OpcoesBusca {
  /**
   * Busca enquanto a pessoa digita (campo da capa da Universidade): a última
   * palavra ainda está pela metade, então casa também como começo de palavra
   * ("descon" acha "desconectou"). A API do agente não usa: lá a frase chega inteira.
   */
  prefixoFinal?: boolean;
  /**
   * Parte dos termos da consulta que o trecho precisa cobrir (padrão: metade). O
   * campo da capa pede mais, porque mostra o primeiro resultado em destaque: com
   * metade, "automação não disparou" achava um trecho só por causa de "automação".
   */
  coberturaMinima?: number;
}

function comparador(consulta: string, opcoes: OpcoesBusca) {
  if (!opcoes.prefixoFinal || /\s$/.test(consulta)) return casa;
  const ultima = normalizar(consulta).split(/[^a-z0-9]+/).filter(Boolean).at(-1);
  // sozinha, uma palavra de 3 letras casa com meio catálogo ("con"); depois de outra
  // palavra ela já tem contexto ("lead sum")
  const minimo = termos(consulta).length > 1 ? 3 : 4;
  if (!ultima || ultima.length < minimo || PARADAS.has(ultima)) return casa;
  const alvo = radical(ultima);
  return (q: string, c: string) => casa(q, c) || (q === alvo && c.startsWith(ultima));
}

/**
 * Procura o trecho que responde à dúvida. Sintoma vale 5, título/pergunta 3,
 * resposta/legendas 1. Só entra quem passa da pontuação mínima e cobre ao menos
 * metade dos termos da consulta. Empate: o clipe mais curto (mais específico) primeiro.
 */
export function buscarClipes(
  consulta: string,
  limite = 5,
  opcoes: OpcoesBusca = {},
): ClipeEncontrado[] {
  const q = [...new Set(termos(consulta))];
  if (q.length === 0) return [];
  const igual = comparador(consulta, opcoes);
  const achados: ClipeEncontrado[] = [];
  for (const page of tutoriaisPublicados()) {
    for (const c of page.data.clipes) {
      const casados = new Set<string>();
      const sintomas = c.sintomas.flatMap(termos);
      const titulos = termos(`${c.titulo} ${c.pergunta ?? ''} ${page.data.title}`);
      const corpo = termos(`${c.resposta} ${c.legendas.join(' ')} ${c.texto ?? ''}`);
      const pontuacao =
        pontuar(q, sintomas, 5, casados, igual) +
        pontuar(q, titulos, 3, casados, igual) +
        pontuar(q, corpo, 1, casados, igual);
      const cobertura = casados.size / q.length;
      if (pontuacao < PONTUACAO_MINIMA || cobertura < (opcoes.coberturaMinima ?? COBERTURA_MINIMA)) continue;
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

/**
 * Tutoriais ainda sem vídeo que respondem à consulta: todos os termos dela precisam
 * estar no título ou nos sintomas do item.
 */
export function emProducaoPara(consulta: string): TutorialEmProducao[] {
  const q = [...new Set(termos(consulta))];
  if (q.length === 0) return [];
  return EM_PRODUCAO.filter((item) => {
    const campo = termos(`${item.titulo} ${item.tema} ${item.sintomas.join(' ')}`);
    return q.every((t) => campo.some((c) => casa(t, c)));
  });
}

/**
 * Exemplos do campo "O que deu errado?": o `exemplo_busca` do frontmatter de cada
 * tutorial, na ordem dos mais enviados pelo suporte. Só entra o exemplo que, buscado,
 * devolve um trecho do próprio tutorial em primeiro lugar: se o catálogo mudar e a
 * frase deixar de achar, ela some da capa em vez de levar a uma lista vazia.
 */
export function exemplosDeBusca(limite = 3): string[] {
  const exemplos: string[] = [];
  const ordem = [...new Set([...maisEnviados(25).map((d) => d.page), ...tutoriaisPublicados()])];
  for (const page of ordem) {
    const frase = page.data.exemplo_busca?.trim();
    if (!frase) continue;
    if (buscarClipes(frase, 1)[0]?.tutorial_slug !== page.slugs[0]) continue;
    exemplos.push(frase);
    if (exemplos.length === limite) break;
  }
  return exemplos;
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
