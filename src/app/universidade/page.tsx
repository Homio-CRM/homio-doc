import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { BuscaSintoma } from '@/components/universidade/BuscaSintoma';
import { MaisEnviados } from '@/components/universidade/MaisEnviados';
import { ReguaModulos, type ItemRegua } from '@/components/universidade/ReguaModulos';
import { SecaoTema } from '@/components/universidade/SecaoTema';
import { TutorialCard } from '@/components/universidade/TutorialCard';
import {
  exemplosDeBusca,
  idTema,
  maisEnviados,
  problemasComuns,
  tutoriaisPorTema,
} from '@/lib/universidade';
import { EM_PRODUCAO } from '@/lib/universidade-producao';
import { iconeLucide, temaInfo } from '@/lib/universidade-temas';

export const metadata: Metadata = {
  title: 'Universidade Homio',
  description:
    'Tutoriais em vídeo gravados na própria Homio: o caminho completo de cada tarefa e os problemas mais comuns, com a solução.',
  robots: { index: false, follow: true },
};

export default function UniversidadePage() {
  const temas = [...tutoriaisPorTema().entries()];
  const temDestaques = maisEnviados(1).length > 0;
  const temasEmProducao = [...new Set(EM_PRODUCAO.map((t) => t.tema))].filter(
    (tema) => !temas.some(([t]) => t === tema),
  );

  const toc = [
    ...(temDestaques ? [{ title: 'Mais enviados', url: '#mais-enviados', depth: 2 }] : []),
    ...temas.map(([tema]) => ({ title: tema, url: `#${idTema(tema)}`, depth: 2 })),
    { title: 'Em produção', url: '#em-producao', depth: 2 },
  ];

  const regua: ItemRegua[] = [
    ...temas.map(([tema]) => ({ id: idTema(tema), rotulo: tema })),
    ...temasEmProducao.map((tema) => ({ id: 'em-producao', rotulo: tema, emProducao: true })),
  ];

  return (
    <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }} breadcrumb={{ enabled: false }}>
      <DocsTitle>Universidade Homio</DocsTitle>
      <DocsDescription className="max-w-[64ch]">
        Tutoriais curtos gravados na própria Homio: o caminho completo de cada tarefa e os
        problemas mais comuns, cada um com link próprio.
      </DocsDescription>
      <DocsBody>
        {temas.length === 0 ? (
          <p>
            Os primeiros tutoriais estão sendo publicados. Enquanto isso, a{' '}
            <Link href="/docs">documentação em texto</Link> cobre todos os módulos.
          </p>
        ) : null}

        {temas.length > 0 ? <BuscaSintoma exemplos={exemplosDeBusca()} /> : null}
        <ReguaModulos itens={regua} />
        <div className="not-prose mt-4">
          <MaisEnviados />
        </div>

        {temas.map(([tema, pages]) => {
          const info = temaInfo(tema);
          const id = idTema(tema);
          const problemas = pages.reduce((soma, p) => soma + problemasComuns(p).length, 0);
          return (
            <SecaoTema key={tema} id={id} rotuladaPor={`${id}-titulo`} className="not-prose mt-10 scroll-mt-[calc(var(--fd-nav-height,0px)+var(--fd-tocnav-height,0px)+4.75rem)]">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
                  {iconeLucide(info.icone, { className: 'size-5', 'aria-hidden': true })}
                </span>
                <h2 id={`${id}-titulo`} className="text-xl font-semibold text-fd-foreground">
                  {tema}
                </h2>
                <p className="text-sm tabular-nums text-fd-muted-foreground">
                  {pages.length} {pages.length === 1 ? 'tutorial' : 'tutoriais'}
                  {problemas > 0 ? ` · ${problemas} problemas comuns` : ''}
                </p>
                {info.doc ? (
                  <Link
                    href={info.doc}
                    className="ml-auto inline-flex min-h-11 items-center gap-1 text-sm font-medium text-fd-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
                  >
                    Ler em texto
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                ) : null}
              </div>
              <ul className={`mt-4 grid gap-3 sm:gap-4 ${pages.length > 1 ? 'lg:grid-cols-2' : ''}`}>
                {pages.map((page) => (
                  <li key={page.url}>
                    <TutorialCard page={page} largo={pages.length === 1} />
                  </li>
                ))}
              </ul>
            </SecaoTema>
          );
        })}

        <section id="em-producao" aria-labelledby="em-producao-titulo" className="not-prose mt-10 scroll-mt-[calc(var(--fd-nav-height,0px)+var(--fd-tocnav-height,0px)+4.75rem)]">
          <h2 id="em-producao-titulo" className="text-xl font-semibold text-fd-foreground">
            Em produção
          </h2>
          <p className="mt-1 max-w-[64ch] text-sm text-fd-muted-foreground">
            Próximos tutoriais, na ordem do que mais gera dúvida no suporte. Enquanto o vídeo não
            sai, a documentação em texto cobre o assunto.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {EM_PRODUCAO.map((item) => {
              const info = temaInfo(item.tema);
              return (
                <li
                  key={item.titulo}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-dashed border-fd-border px-3 py-2.5"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-fd-muted text-fd-muted-foreground">
                    {iconeLucide(info.icone, { className: 'size-4', 'aria-hidden': true })}
                  </span>
                  <span className="text-sm font-medium text-fd-foreground">{item.titulo}</span>
                  <span className="text-xs text-fd-muted-foreground">{item.tema}</span>
                  {info.doc ? (
                    <Link
                      href={info.doc}
                      className="ml-auto inline-flex min-h-11 items-center text-sm font-medium text-fd-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring sm:min-h-0"
                    >
                      Ler em texto
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      </DocsBody>
    </DocsPage>
  );
}
