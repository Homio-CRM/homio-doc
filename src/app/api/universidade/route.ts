import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { buscarClipes, catalogo } from '@/lib/universidade';

export const runtime = 'nodejs';

/**
 * API da Universidade Homio pro agente de suporte (action "Consulta externa" do
 * Homio AI Agent) e pra qualquer integração nossa.
 *
 *   GET /api/universidade?q=meu whatsapp desconectou   → trechos que respondem, com link
 *   GET /api/universidade                              → catálogo completo
 *
 * Auth: header `x-api-key` (ou `Authorization: Bearer`) igual a UNIVERSIDADE_API_KEY.
 * Sem a variável no ambiente a rota responde 503, nunca aberta.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
};

function json(corpo: unknown, status = 200) {
  return NextResponse.json(corpo, { status, headers: CORS });
}

function chaveConfere(req: Request): 'ok' | 'negado' | 'nao_configurada' {
  const esperada = process.env.UNIVERSIDADE_API_KEY;
  if (!esperada) return 'nao_configurada';
  const recebida =
    req.headers.get('x-api-key') ??
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    '';
  const a = Buffer.from(recebida);
  const b = Buffer.from(esperada);
  if (a.length !== b.length) return 'negado';
  return timingSafeEqual(a, b) ? 'ok' : 'negado';
}

export async function GET(req: Request) {
  const auth = chaveConfere(req);
  if (auth === 'nao_configurada') {
    return json({ erro: 'API não configurada: defina UNIVERSIDADE_API_KEY no ambiente.' }, 503);
  }
  if (auth === 'negado') return json({ erro: 'Chave inválida.' }, 401);

  const url = new URL(req.url);
  const consulta = url.searchParams.get('q')?.trim() ?? '';
  const limite = Math.min(10, Math.max(1, Number(url.searchParams.get('limite')) || 5));

  if (!consulta) return json({ tutoriais: catalogo() });

  const clipes = buscarClipes(consulta, limite);
  const primeiro = clipes[0];
  let orientacao: string;
  if (!primeiro) {
    orientacao =
      'Nenhum tutorial cobre essa dúvida ainda. Responda com a base de conhecimento e, se não resolver, encaminhe para um humano.';
  } else if (primeiro.confianca === 'alta') {
    orientacao =
      'Use o campo `resposta` do primeiro resultado (já traz o link do trecho). Se a conversa for no WhatsApp, o `mp4` pode ser enviado como vídeo.';
  } else {
    orientacao =
      'Correspondência parcial: confirme com o cliente se é esse o caso (use o campo `pergunta`) antes de mandar a `resposta` e o link.';
  }
  return json({ consulta, total: clipes.length, orientacao, clipes });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
