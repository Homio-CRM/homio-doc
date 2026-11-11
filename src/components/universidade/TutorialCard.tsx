import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import {
  clipePrincipal,
  formatarDuracao,
  problemasComuns,
  type TutorialPage,
} from '@/lib/universidade';

const CHIPS_VISIVEIS = 3;

/**
 * Card do índice. No celular é uma linha compacta (capa à esquerda, título e
 * duração); a partir de `sm` vira o card vertical da grade, com descrição e os
 * três primeiros problemas comuns. É um <div>, não <article>: o DocsLayout aplica
 * padding a todo article dentro da página.
 */
export function TutorialCard({ page }: { page: TutorialPage }) {
  const principal = clipePrincipal(page);
  const problemas = problemasComuns(page);
  const chips = problemas.slice(0, CHIPS_VISIVEIS);
  const restantes = problemas.length - chips.length;
  const idTitulo = `tutorial-${page.slugs[0] ?? page.url}`;

  return (
    <div
      aria-labelledby={idTitulo}
      className="group grid h-full grid-cols-[6.5rem_minmax(0,1fr)] gap-3 rounded-xl border border-fd-border bg-fd-card p-3 sm:grid-cols-1 sm:grid-rows-[auto_1fr] sm:gap-0 sm:overflow-hidden sm:p-0 dark:bg-fd-secondary/40"
    >
      <Link
        href={page.url}
        aria-label={`Assistir: ${page.data.title}`}
        className="relative block self-start overflow-hidden rounded-md bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring sm:rounded-none"
      >
        {principal.capa ? (
          <Image
            src={principal.capa}
            alt=""
            width={640}
            height={360}
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 60vw, 6.5rem"
            className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
          />
        ) : (
          <div className="aspect-video w-full bg-fd-muted" />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none sm:size-12">
            <Play className="ml-0.5 size-3.5 sm:size-5" fill="currentColor" aria-hidden />
          </span>
        </span>
        {principal.duracao ? (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white sm:bottom-2 sm:right-2">
            {formatarDuracao(principal.duracao)}
          </span>
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-col sm:p-4">
        <h3 id={idTitulo} className="text-sm font-semibold leading-snug sm:text-base">
          <Link href={page.url} className="underline-offset-4 hover:underline">
            {page.data.title}
          </Link>
        </h3>
        {page.data.description ? (
          <p className="mt-1.5 hidden text-sm leading-relaxed text-fd-muted-foreground sm:line-clamp-2">
            {page.data.description}
          </p>
        ) : null}
        <p className="mt-1 text-xs tabular-nums text-fd-muted-foreground sm:mt-2">
          {principal.duracao ? `Vídeo principal de ${formatarDuracao(principal.duracao)}` : 'Vídeo principal'}
          {problemas.length > 0
            ? ` · ${problemas.length} ${problemas.length === 1 ? 'problema comum' : 'problemas comuns'}`
            : ''}
        </p>
        {chips.length > 0 ? (
          <ul className="mt-auto hidden flex-wrap gap-2 pt-3 sm:flex" aria-label="Problemas comuns">
            {chips.map((c) => (
              <li key={c.ancora} className="max-w-full">
                <Link
                  href={`${page.url}#${c.ancora}`}
                  title={c.titulo}
                  className="inline-flex max-w-full min-h-8 items-center rounded-full border border-fd-border bg-fd-background px-3 py-1 text-xs text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring dark:bg-fd-muted"
                >
                  <span className="truncate">{c.titulo}</span>
                </Link>
              </li>
            ))}
            {restantes > 0 ? (
              <li>
                <Link
                  href={`${page.url}#problemas-comuns`}
                  aria-label={`Mais ${restantes} problemas comuns de ${page.data.title}`}
                  className="inline-flex min-h-8 items-center rounded-full px-2 py-1 text-xs font-medium text-fd-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
                >
                  +{restantes}
                </Link>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
