import Link from 'next/link';
import { FileText, Play } from 'lucide-react';
import { formatarDuracao, maisEnviados, urlClipe } from '@/lib/universidade';

/**
 * Faixa do índice com os trechos que mais aparecem no suporte (campo `suporte_rank`
 * dos clipes). Cada item é a dúvida nas palavras do cliente e leva direto à âncora.
 */
export function MaisEnviados() {
  const itens = maisEnviados(8);
  if (itens.length === 0) return null;

  return (
    <section
      id="mais-enviados"
      aria-labelledby="mais-enviados-titulo"
      className="not-prose scroll-mt-24 rounded-2xl border border-fd-primary/20 bg-fd-primary/5 p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="mais-enviados-titulo" className="text-lg font-semibold text-fd-foreground">
          Os problemas mais enviados pelo suporte
        </h2>
        <p className="text-sm text-fd-muted-foreground">
          Da análise de 12 meses de conversas de suporte.
        </p>
      </div>
      <ol className="mt-3 grid gap-x-6 sm:grid-cols-2">
        {itens.map(({ page, clipe }) => (
          <li key={`${page.url}#${clipe.ancora}`}>
            <Link
              href={urlClipe(page, clipe)}
              className="group -mx-2 flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-fd-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
            >
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
                {clipe.mp4 ? (
                  <Play className="ml-px size-3.5" fill="currentColor" aria-hidden />
                ) : (
                  <FileText className="size-3.5" aria-hidden />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug text-fd-foreground underline-offset-4 group-hover:underline">
                  {clipe.pergunta ?? clipe.titulo}
                </span>
                <span className="mt-0.5 block text-xs text-fd-muted-foreground">
                  {page.data.tema}
                  {clipe.duracao ? ` · ${formatarDuracao(clipe.duracao)}` : ' · resposta em texto'}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
