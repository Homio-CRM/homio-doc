import Image from 'next/image';
import { FileText } from 'lucide-react';
import { formatarDuracao, type Clipe } from '@/lib/universidade';

/**
 * Trilho com os trechos do tutorial, logo abaixo do vídeo principal: uma miniatura
 * por clipe, levando à âncora. Importa onde o sumário lateral não aparece (abaixo
 * de 1280 px) e serve de mapa do tutorial em qualquer largura.
 */
export function TrilhoClipes({ clipes }: { clipes: Clipe[] }) {
  if (clipes.length < 2) return null;
  return (
    <nav
      aria-label="Trechos deste tutorial"
      className="not-prose -mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <ol className="flex w-max gap-3 py-1">
        {clipes.map((c) => {
          const principal = c.tipo === 'principal';
          const capa = c.capa_molde ?? c.capa;
          return (
            <li key={c.ancora} className="w-36 shrink-0">
              <a
                href={principal ? '#video-principal' : `#${c.ancora}`}
                className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
              >
                <span className="relative block aspect-video overflow-hidden rounded-md border border-fd-border bg-fd-muted">
                  {capa ? (
                    <Image
                      src={capa}
                      alt=""
                      width={320}
                      height={180}
                      sizes="9rem"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-fd-muted-foreground">
                      <FileText className="size-5" aria-hidden />
                    </span>
                  )}
                  {c.duracao ? (
                    <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white">
                      {formatarDuracao(c.duracao)}
                    </span>
                  ) : null}
                </span>
                <span className="mt-1.5 line-clamp-2 text-xs leading-snug text-fd-foreground underline-offset-4 group-hover:underline">
                  {principal ? 'O caminho completo' : c.titulo}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
