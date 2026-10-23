import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { TOCItemType } from 'fumadocs-core/toc';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { getMDXComponents } from '@/mdx-components';
import { AncoraAtiva } from '@/components/universidade/AncoraAtiva';
import { CopiarLink } from '@/components/universidade/CopiarLink';
import { VideoClipe } from '@/components/universidade/VideoClipe';
import {
  clipePrincipal,
  problemasComuns,
  respostaSemLink,
  tutorialPorSlug,
  tutoriaisPublicados,
  urlClipe,
  type Clipe,
  type TutorialPage,
} from '@/lib/universidade';

export default async function TutorialPage(props: PageProps<'/universidade/[slug]'>) {
  const { slug } = await props.params;
  const page = tutorialPorSlug(slug);
  if (!page) notFound();

  const principal = clipePrincipal(page);
  const problemas = problemasComuns(page);
  const MDX = page.data.body;

  const toc: TOCItemType[] = [];
  if (principal.legendas.length > 0) {
    toc.push({ title: 'O que o vídeo mostra', url: '#o-que-o-video-mostra', depth: 2 });
  }
  if (problemas.length > 0) {
    toc.push({ title: 'Problemas comuns', url: '#problemas-comuns', depth: 2 });
    for (const c of problemas) toc.push({ title: c.titulo, url: `#${c.ancora}`, depth: 3 });
  }

  return (
    <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }}>
      <AncoraAtiva />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <div className="not-prose flex items-center justify-end">
          <CopiarLink url={urlClipe(page, principal, true)} descricao={page.data.title} />
        </div>
        <VideoClipe clipe={principal} prioridade rotulo={`${page.data.title}: vídeo completo`} />

        <MDX components={getMDXComponents()} />

        {principal.legendas.length > 0 ? (
          <section aria-labelledby="o-que-o-video-mostra">
            <h2 id="o-que-o-video-mostra">O que o vídeo mostra</h2>
            <ol>
              {principal.legendas.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ol>
          </section>
        ) : null}

        {problemas.length > 0 ? (
          <section aria-labelledby="problemas-comuns">
            <h2 id="problemas-comuns">Problemas comuns</h2>
            <p>
              Cada situação tem um vídeo curto com a solução. O link de cada trecho pode ser
              copiado e enviado.
            </p>
            {problemas.map((c) => (
              <ClipeSecao key={c.ancora} page={page} clipe={c} />
            ))}
          </section>
        ) : null}

        <p className="text-sm text-fd-muted-foreground">
          Não resolveu? Fale com o suporte pelo WhatsApp da Homio ou pelo botão Suporte na{' '}
          <Link href="/">página inicial</Link>.
        </p>
      </DocsBody>
    </DocsPage>
  );
}

function ClipeSecao({ page, clipe }: { page: TutorialPage; clipe: Clipe }) {
  return (
    <section id={clipe.ancora} data-clipe aria-labelledby={`${clipe.ancora}-titulo`}>
      <div className="flex items-start justify-between gap-4">
        <h3 id={`${clipe.ancora}-titulo`} className="!mt-0">
          {clipe.titulo}
        </h3>
        <span className="not-prose mt-1">
          <CopiarLink url={urlClipe(page, clipe, true)} descricao={clipe.titulo} />
        </span>
      </div>
      {clipe.pergunta ? (
        <p className="!mt-1 text-fd-muted-foreground">
          <q>{clipe.pergunta}</q>
        </p>
      ) : null}
      <p>{clipe.tipo === 'texto' && clipe.texto ? clipe.texto : respostaSemLink(clipe)}</p>
      {clipe.mp4 ? (
        <div className="grid items-start gap-x-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <VideoClipe clipe={clipe} />
          {clipe.legendas.length > 0 ? (
            <ol className="!my-5 text-sm">
              {clipe.legendas.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export function generateStaticParams() {
  return tutoriaisPublicados().map((p) => ({ slug: p.slugs[0] ?? '' }));
}

export async function generateMetadata(
  props: PageProps<'/universidade/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = tutorialPorSlug(slug);
  if (!page) notFound();
  const capa = clipePrincipal(page).capa;
  return {
    title: `${page.data.title} | Universidade Homio`,
    description: page.data.description,
    robots: { index: false, follow: true },
    openGraph: capa ? { images: [{ url: capa, width: 1920, height: 1080 }] } : undefined,
  };
}
