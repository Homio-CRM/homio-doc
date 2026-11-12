import Link from 'next/link';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { BuscaSintoma } from '@/components/universidade/BuscaSintoma';
import { MaisEnviados } from '@/components/universidade/MaisEnviados';
import { exemplosDeBusca } from '@/lib/universidade';

/**
 * Link de tutorial que não existe mais. Os links da Universidade ficam em conversas
 * antigas de WhatsApp: quem cai aqui chegou com um problema, então a página devolve
 * a busca por sintoma e os trechos mais enviados, em vez do 404 padrão.
 */
export default function TutorialNaoEncontrado() {
  return (
    <DocsPage breadcrumb={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <DocsTitle>Esse tutorial mudou de lugar</DocsTitle>
      <DocsDescription className="max-w-[64ch]">
        O link que você abriu não leva mais a um vídeo. Escreva o que aconteceu e a busca mostra o
        trecho que resolve.
      </DocsDescription>
      <DocsBody>
        <BuscaSintoma exemplos={exemplosDeBusca()} />
        <div className="not-prose">
          <MaisEnviados />
        </div>
        <p className="not-prose mt-6 text-sm text-fd-muted-foreground">
          <Link
            href="/universidade"
            className="inline-flex min-h-11 items-center font-medium text-fd-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
          >
            Ver todos os tutoriais
          </Link>
        </p>
      </DocsBody>
    </DocsPage>
  );
}
