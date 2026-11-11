import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

/**
 * Universidade Homio: tutoriais em vídeo.
 *
 * Um arquivo MDX por tutorial em `content/universidade/`. O frontmatter carrega o
 * catálogo inteiro (clipes, âncoras, legendas, resposta pronta pro agente, sintomas);
 * o corpo do MDX é só o texto de apoio que aparece abaixo do vídeo principal.
 *
 * `resposta` pode conter `{link}`: vira a URL absoluta do clipe (com âncora) na API,
 * na busca e no texto pro assistente de IA.
 */
const clipeSchema = z.object({
  /** id do trecho; vira `#ancora` na URL. O clipe principal usa `principal`. */
  ancora: z.string().regex(/^[a-z0-9-]+$/, 'âncora só com letras minúsculas, números e hífen'),
  titulo: z.string(),
  /** como o cliente formula a dúvida; aparece no índice e pesa na busca */
  pergunta: z.string().optional(),
  tipo: z.enum(['principal', 'erro', 'texto']).default('erro'),
  /** segundos */
  duracao: z.number().int().positive().optional(),
  narrado: z.boolean().default(true),
  mp4: z.string().url().optional(),
  capa: z.string().url().optional(),
  /** legendas na ordem do vídeo; é o passo a passo em texto */
  legendas: z.array(z.string()).default([]),
  /** parágrafo pronto pro agente mandar; `{link}` vira a URL do clipe */
  resposta: z.string(),
  /** palavras e frases que o cliente usa quando tem esse problema */
  sintomas: z.array(z.string()).default([]),
  /** para `tipo: texto` (sem vídeo): o texto que aparece na página */
  texto: z.string().optional(),
});

export const universidade = defineDocs({
  dir: 'content/universidade',
  docs: {
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      /** título curto pra barra lateral; sem ele, usa `title` */
      menu: z.string().optional(),
      full: z.boolean().optional(),
      /** agrupa no índice e na barra lateral */
      tema: z.string(),
      /** ordem dentro do tema (e dos temas, pelo menor valor) */
      ordem: z.number().int().default(99),
      /** false = fica fora do índice, da busca, da API e devolve 404 */
      publicado: z.boolean().default(true),
      clipes: z.array(clipeSchema).min(1),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
