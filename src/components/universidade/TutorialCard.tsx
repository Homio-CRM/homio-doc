import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import {
  clipePrincipal,
  duracaoTotal,
  formatarDuracao,
  problemasComuns,
  type TutorialPage,
} from '@/lib/universidade';

export function TutorialCard({ page }: { page: TutorialPage }) {
  const principal = clipePrincipal(page);
  const problemas = problemasComuns(page);
  const videos = page.data.clipes.filter((c) => c.mp4).length;

  return (
    <article className="group grid gap-5 rounded-xl border border-fd-border bg-fd-card p-4 sm:grid-cols-[minmax(0,17rem)_1fr] sm:p-5">
      <Link
        href={page.url}
        aria-label={`Assistir: ${page.data.title}`}
        className="relative block self-start overflow-hidden rounded-lg bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
      >
        {principal.capa ? (
          <Image
            src={principal.capa}
            alt=""
            width={640}
            height={360}
            sizes="(min-width: 640px) 17rem, 100vw"
            className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
          />
        ) : (
          <div className="aspect-video w-full bg-fd-muted" />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none">
            <Play className="ml-0.5 size-5" fill="currentColor" aria-hidden />
          </span>
        </span>
        {principal.duracao ? (
          <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white">
            {formatarDuracao(principal.duracao)}
          </span>
        ) : null}
      </Link>

      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={page.url} className="underline-offset-4 hover:underline">
            {page.data.title}
          </Link>
        </h3>
        {page.data.description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">
            {page.data.description}
          </p>
        ) : null}
        <p className="mt-2 text-xs tabular-nums text-fd-muted-foreground">
          {videos} {videos === 1 ? 'vídeo' : 'vídeos'}
          {duracaoTotal(page) ? ` · ${formatarDuracao(duracaoTotal(page))} no total` : ''}
        </p>
        {problemas.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Problemas comuns">
            {problemas.map((c) => (
              <li key={c.ancora}>
                <Link
                  href={`${page.url}#${c.ancora}`}
                  className="inline-flex rounded-full border border-fd-border bg-fd-background px-2.5 py-1 text-xs text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
                >
                  {c.titulo}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
