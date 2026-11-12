/**
 * Formato da busca pública da capa da Universidade (`/api/universidade/buscar`).
 * Fica separado do `universidade.ts` pra o componente do navegador importar o tipo
 * sem carregar o catálogo.
 */
export interface TrechoEncontrado {
  /** caminho do trecho, com âncora (`/universidade/slug#ancora`) */
  url: string;
  /** a dúvida nas palavras do cliente; cai no título do trecho quando não há */
  pergunta: string;
  titulo: string;
  tema: string;
  /** título curto do tutorial (campo `menu`) */
  tutorial: string;
  duracao_s?: number;
  /** false = resposta em texto, sem clipe */
  video: boolean;
  /** só com `suporte=1`: link absoluto do trecho, pra colar na conversa */
  link?: string;
  /** só com `suporte=1`: a resposta pronta do catálogo, já com o link */
  resposta?: string;
}

/** assunto mapeado que ainda não tem vídeo */
export interface AssuntoEmProducao {
  titulo: string;
  tema: string;
  /** página de /docs que cobre o assunto em texto */
  doc?: string;
}

export interface RespostaBusca {
  consulta: string;
  trechos: TrechoEncontrado[];
  emProducao: AssuntoEmProducao[];
}

/** teto do que a rota aceita; frase de cliente cabe com folga */
export const CONSULTA_MAXIMA = 120;
