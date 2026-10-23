import { getLLMText, source } from '@/lib/source';
import { textoUniversidadeParaLLM } from '@/lib/universidade';

export const revalidate = false;

export async function GET() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response([...scanned, textoUniversidadeParaLLM()].join('\n\n'));
}
