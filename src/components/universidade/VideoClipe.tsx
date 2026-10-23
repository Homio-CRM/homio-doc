import type { Clipe } from '@/lib/universidade';
import { formatarDuracao } from '@/lib/universidade';

interface Props {
  clipe: Clipe;
  /** o vídeo que abre a página carrega os metadados; os outros só ao dar play */
  prioridade?: boolean;
  rotulo?: string;
}

export function VideoClipe({ clipe, prioridade = false, rotulo }: Props) {
  if (!clipe.mp4) return null;
  return (
    <figure className="not-prose my-5">
      <div className="overflow-hidden rounded-xl border border-fd-border bg-black">
        <video
          className="block aspect-video w-full"
          controls
          playsInline
          preload={prioridade ? 'metadata' : 'none'}
          poster={clipe.capa}
          src={clipe.mp4}
          aria-label={rotulo ?? clipe.titulo}
        >
          Seu navegador não reproduz este vídeo.{' '}
          <a href={clipe.mp4}>Baixe o arquivo</a>.
        </video>
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fd-muted-foreground">
        {clipe.duracao ? (
          <span className="tabular-nums">{formatarDuracao(clipe.duracao)}</span>
        ) : null}
        <span>Legendas na tela</span>
        {clipe.narrado ? (
          <span>Narrado</span>
        ) : (
          <span className="rounded-full bg-fd-accent px-2 py-0.5 text-fd-accent-foreground">
            Sem narração ainda
          </span>
        )}
      </figcaption>
    </figure>
  );
}
