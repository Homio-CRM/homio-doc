import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { TOCItemType } from 'fumadocs-core/toc';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { getMDXComponents } from '@/mdx-components';
import { SupportDialog } from '@/components/SupportDialog';
import { AncoraAtiva } from '@/components/universidade/AncoraAtiva';
import { CopiarLink } from '@/components/universidade/CopiarLink';
import { CopiarResposta } from '@/components/universidade/CopiarResposta';
import { TrilhoClipes } from '@/components/universidade/TrilhoClipes';
import { VideoClipe } from '@/components/universidade/VideoClipe';
import {
  clipePrincipal,
  problemasComuns,
  respostaComLink,
  respostaSemLink,
  tutorialPorSlug,
  tutoriaisPublicados,
  urlClipe,
  type Clipe,
  type TutorialPage,
} from '@/lib/universidade';
import { temaInfo } from '@/lib/universidade-temas';

const BOTAO_SUPORTE_LINK =
  'font-medium text-fd-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring';

export default async function TutorialPage(props: PageProps<'/universidade/[slug]'>) {
  const { slug } = await props.params;
  const page = tutorialPorSlug(slug);
  if (!page) notFound();

  const principal = clipePrincipal(page);
  const problemas = problemasComuns(page);
  const tema = temaInfo(page.data.tema);
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
    <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }} breadcrumb={{ enabled: false }}>
      <AncoraAtiva />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CopiarLink url={urlClipe(page, principal, true)} descricao={page.data.title} />
          <CopiarResposta texto={respostaComLink(page, principal)} descricao={page.data.title} />
        </div>
        <div id="video-principal" className="scroll-mt-24">
          <VideoClipe clipe={principal} prioridade rotulo={`${page.data.title}: vídeo completo`} />
        </div>
        <TrilhoClipes clipes={page.data.clipes} />

        <MDX components={getMDXComponents()} />

        {principal.legendas.length > 0 ? (
          <details>
            <summary>
              <h2 id="o-que-o-video-mostra" className="!my-0 inline text-xl">
                O que o vídeo mostra
              </h2>
              <span className="ml-2 text-sm font-normal text-fd-muted-foreground">
                {principal.legendas.length} passos
              </span>
            </summary>
            <ol className="!mt-3">
              {principal.legendas.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ol>
          </details>
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

        <div className="not-prose mt-10 rounded-xl border border-fd-border bg-fd-card p-5 dark:bg-fd-secondary/40">
          <p className="font-semibold text-fd-foreground">Não resolveu?</p>
          <p className="mt-1 text-sm text-fd-muted-foreground">
            Fale com o suporte da Homio. Diga qual trecho você viu e o que apareceu na sua tela.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <SupportDialog
              rotulo="Falar com o suporte"
              className="inline-flex min-h-9 items-center rounded-md bg-fd-primary px-3 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
              modulo={tema.suporte}
              contexto={`Vi o tutorial "${page.data.title}" e não resolveu.`}
            />
            {tema.doc ? (
              <Link
                href={tema.doc}
                className="inline-flex min-h-9 items-center rounded-md border border-fd-border bg-fd-background px-3 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring dark:bg-fd-muted"
              >
                Ler a documentação em texto
              </Link>
            ) : null}
          </div>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

function ClipeSecao({ page, clipe }: { page: TutorialPage; clipe: Clipe }) {
  const tema = temaInfo(page.data.tema);
  return (
    <section id={clipe.ancora} data-clipe aria-labelledby={`${clipe.ancora}-titulo`}>
      <h3 id={`${clipe.ancora}-titulo`} className="!my-0">
        {clipe.titulo}
      </h3>
      {clipe.pergunta ? (
        <p className="!mt-2 text-fd-muted-foreground">
          <q>{clipe.pergunta}</q>
        </p>
      ) : null}
      <div className="not-prose mt-3 flex flex-wrap items-center gap-2">
        <CopiarLink url={urlClipe(page, clipe, true)} descricao={clipe.titulo} />
        <CopiarResposta texto={respostaComLink(page, clipe)} descricao={clipe.titulo} />
      </div>
      {clipe.mp4 ? <VideoClipe clipe={clipe} /> : null}
      <p>{clipe.tipo === 'texto' && clipe.texto ? clipe.texto : respostaSemLink(clipe)}</p>
      {clipe.mp4 && clipe.legendas.length > 0 ? (
        <details className="!mt-0 text-sm">
          <summary>Ler os passos ({clipe.legendas.length})</summary>
          <ol className="!mt-2">
            {clipe.legendas.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ol>
        </details>
      ) : null}
      <p className="!mt-3 text-sm text-fd-muted-foreground">
        Não resolveu?{' '}
        <SupportDialog
          rotulo="Falar com o suporte"
          className={BOTAO_SUPORTE_LINK}
          modulo={tema.suporte}
          contexto={`Vi o tutorial "${page.data.title}", trecho "${clipe.titulo}", e não resolveu.`}
        />
      </p>
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
  const principal = clipePrincipal(page);
  const og = principal.capa_molde
    ? { url: principal.capa_molde, width: 1280, height: 720 }
    : principal.capa
      ? { url: principal.capa, width: 1920, height: 1080 }
      : undefined;
  return {
    title: `${page.data.title} | Universidade Homio`,
    description: page.data.description,
    robots: { index: false, follow: true },
    openGraph: og ? { images: [og] } : undefined,
  };
}
