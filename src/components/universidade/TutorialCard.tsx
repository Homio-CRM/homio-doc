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

interface Props {
  page: TutorialPage;
  /** módulo com um tutorial só: card deitado, capa maior, em vez de meia grade vazia */
  largo?: boolean;
}

/**
 * Card do índice. No celular é uma linha compacta (capa à esquerda, título e
 * duração); a partir de `sm` vira o card vertical da grade, com descrição e os
 * três primeiros problemas comuns. A capa em molde já traz o título, por isso o
 * play fica no selo de duração, no canto, e não no centro. É um <div>, não
 * <article>: o DocsLayout aplica padding a todo article dentro da página.
 */
export function TutorialCard({ page, largo = false }: Props) {
  const principal = clipePrincipal(page);
  const problemas = problemasComuns(page);
  const chips = problemas.slice(0, CHIPS_VISIVEIS);
  const restantes = problemas.length - chips.length;
  const idTitulo = `tutorial-${page.slugs[0] ?? page.url}`;
  const capa = principal.capa_molde ?? principal.capa;

  return (
    <div
      aria-labelledby={idTitulo}
      className={
        largo
          ? 'group grid h-full grid-cols-[6.5rem_minmax(0,1fr)] gap-3 rounded-xl border border-fd-border bg-fd-card p-3 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:gap-5 sm:p-4 dark:bg-fd-secondary/40'
          : 'group grid h-full grid-cols-[6.5rem_minmax(0,1fr)] gap-3 rounded-xl border border-fd-border bg-fd-card p-3 sm:grid-cols-1 sm:grid-rows-[auto_1fr] sm:gap-0 sm:overflow-hidden sm:p-0 dark:bg-fd-secondary/40'
      }
    >
      <Link
        href={page.url}
        aria-label={`Assistir: ${page.data.title}`}
        tabIndex={-1}
        className={`relative block self-start overflow-hidden rounded-md bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring ${largo ? 'sm:rounded-lg' : 'sm:rounded-none'}`}
      >
        {capa ? (
          <Image
            src={capa}
            alt=""
            width={640}
            height={360}
            sizes={largo ? '(min-width: 640px) 22rem, 6.5rem' : '(min-width: 1024px) 24rem, (min-width: 640px) 60vw, 6.5rem'}
            className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
          />
        ) : (
          <div className="aspect-video w-full bg-fd-muted" />
        )}
        <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white sm:bottom-2 sm:right-2 sm:text-xs">
          <Play className="size-3" fill="currentColor" aria-hidden />
          {principal.duracao ? formatarDuracao(principal.duracao) : 'vídeo'}
        </span>
      </Link>

      <div className={`flex min-w-0 flex-col ${largo ? 'sm:py-1' : 'sm:p-4'}`}>
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
        {problemas.length > 0 ? (
          <p className="mt-1 text-xs tabular-nums text-fd-muted-foreground sm:mt-2">
            {problemas.length} {problemas.length === 1 ? 'problema comum' : 'problemas comuns'}
          </p>
        ) : null}
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
