import { NextResponse } from 'next/server';
import { buscarClipes, emProducaoPara, SITE_URL, tutorialPorSlug } from '@/lib/universidade';
import {
  CONSULTA_MAXIMA,
  type RespostaBusca,
  type TrechoEncontrado,
} from '@/lib/universidade-busca';
import { temaInfo } from '@/lib/universidade-temas';

export const runtime = 'nodejs';

/**
 * Busca pública do campo "O que deu errado?" da capa da Universidade.
 *
 *   GET /api/universidade/buscar?q=whatsapp descon
 *   GET /api/universidade/buscar?q=whatsapp descon&suporte=1
 *
 * Mesma busca por sintoma da API do agente (`/api/universidade`), sem chave. Para o
 * cliente devolve só o que a lista mostra (pergunta, tema, duração e o caminho do
 * trecho). Com `suporte=1` (modo suporte ligado no navegador da equipe) vem também o
 * link absoluto e a resposta pronta, que já são públicos na página do trecho: o
 * parâmetro poupa a viagem até lá, não libera nada novo. O mp4 nunca vem.
 *
 * A última palavra casa por começo, porque a pessoa ainda está digitando.
 */
export function GET(req: Request) {
  const parametros = new URL(req.url).searchParams;
  const consulta = (parametros.get('q') ?? '').trim().slice(0, CONSULTA_MAXIMA);
  const suporte = parametros.get('suporte') === '1';

  const achados = consulta
    ? buscarClipes(consulta, 6, { prefixoFinal: true, coberturaMinima: 0.6 })
    : [];
  // a cauda da pontuação é ruído numa lista curta: fica quem chega a 60% do primeiro
  const corte = (achados[0]?.pontuacao ?? 0) * 0.6;

  const trechos: TrechoEncontrado[] = achados
    .filter((c) => c.pontuacao >= corte)
    .map((c) => ({
      url: c.url.replace(SITE_URL, ''),
      pergunta: c.pergunta ?? c.titulo,
      titulo: c.titulo,
      tema: c.tema,
      tutorial: tutorialPorSlug(c.tutorial_slug)?.data.menu ?? c.tutorial,
      duracao_s: c.duracao_s,
      video: Boolean(c.mp4),
      ...(suporte ? { link: c.url, resposta: c.resposta } : {}),
    }));

  const emProducao = consulta
    ? emProducaoPara(consulta).map((item) => ({
        titulo: item.titulo,
        tema: item.tema,
        doc: temaInfo(item.tema).doc,
      }))
    : [];

  const corpo: RespostaBusca = { consulta, trechos, emProducao };
  return NextResponse.json(corpo, {
    // o catálogo só muda com deploy, e o deploy limpa o cache da borda
    headers: { 'Cache-Control': 'public, max-age=60, s-maxage=3600' },
  });
}
