import type { Clipe } from '@/lib/universidade';

interface Props {
  clipe: Clipe;
  /** o vídeo que abre a página carrega os metadados; os outros só ao dar play */
  prioridade?: boolean;
  rotulo?: string;
}

/**
 * Poster pelo otimizador de imagem do Next: a capa original tem 60 a 200 KB e o
 * <video> não passa pelo next/image sozinho. As larguras precisam estar nos
 * `deviceSizes` padrão (828 e 1200 estão) e a qualidade em `images.qualities`,
 * que no Next 16 é só 75 (qualquer outro valor devolve 400).
 */
export function posterOtimizado(capa: string | undefined, largura: 828 | 1200): string | undefined {
  if (!capa) return undefined;
  return `/_next/image?url=${encodeURIComponent(capa)}&w=${largura}&q=75`;
}

export function VideoClipe({ clipe, prioridade = false, rotulo }: Props) {
  if (!clipe.mp4) return null;
  // a duração já aparece no player e na capa; a legenda só fica para o aviso de narração
  const mostrarLegenda = !clipe.narrado;
  return (
    <figure className="not-prose my-5">
      <div className="overflow-hidden rounded-xl border border-fd-border bg-black">
        <video
          className="block aspect-video w-full"
          controls
          playsInline
          preload={prioridade ? 'metadata' : 'none'}
          poster={posterOtimizado(clipe.capa, prioridade ? 1200 : 828)}
          src={clipe.mp4}
          aria-label={rotulo ?? clipe.titulo}
        >
          Seu navegador não reproduz este vídeo.{' '}
          <a href={clipe.mp4}>Baixe o arquivo</a>.
        </video>
      </div>
      {mostrarLegenda ? (
        <figcaption className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fd-muted-foreground">
          <span className="rounded-full bg-fd-accent px-2 py-0.5 text-fd-accent-foreground">
            Sem narração ainda
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
