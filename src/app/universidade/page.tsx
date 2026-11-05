import type { Metadata } from 'next';
import Link from 'next/link';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { TutorialCard } from '@/components/universidade/TutorialCard';
import { idTema, tutoriaisPorTema } from '@/lib/universidade';

export const metadata: Metadata = {
  title: 'Universidade Homio',
  description:
    'Tutoriais em vídeo gravados na própria Homio: o caminho completo de cada tarefa e os problemas mais comuns, com a solução.',
  robots: { index: false, follow: true },
};

/** Mapeados e com roteiro escrito; ainda sem vídeo gravado. */
const EM_PRODUCAO = [
  'Minha automação não disparou: o checklist',
  'Contatos: filtros e listas inteligentes',
  'Conversas: achar uma conversa que sumiu da caixa de entrada',
];

export default function UniversidadePage() {
  const temas = [...tutoriaisPorTema().entries()];
  const toc = [
    ...temas.map(([tema]) => ({ title: tema, url: `#${idTema(tema)}`, depth: 2 })),
    { title: 'Em produção', url: '#em-producao', depth: 2 },
  ];

  return (
    <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }} breadcrumb={{ enabled: false }}>
      <DocsTitle>Universidade Homio</DocsTitle>
      <DocsDescription>
        Tutoriais curtos gravados na própria Homio. Cada um mostra o caminho completo e, logo
        abaixo, os problemas mais comuns com a solução. Todo trecho tem link próprio: é o que o
        suporte manda quando você pede ajuda.
      </DocsDescription>
      <DocsBody>
        {temas.length === 0 ? (
          <p>Os primeiros tutoriais estão sendo publicados. Enquanto isso, a{' '}
            <Link href="/docs">documentação em texto</Link> cobre todos os módulos.</p>
        ) : null}

        {temas.map(([tema, pages]) => (
          <section key={tema} aria-labelledby={idTema(tema)}>
            <h2 id={idTema(tema)}>{tema}</h2>
            <ul className="not-prose grid gap-4">
              {pages.map((page) => (
                <li key={page.url}>
                  <TutorialCard page={page} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="em-producao">
          <h2 id="em-producao">Em produção</h2>
          <p>
            Próximos tutoriais, na ordem do que mais gera dúvida no suporte. Enquanto o vídeo não
            sai, a <Link href="/docs">documentação em texto</Link> cobre o assunto.
          </p>
          <ul>
            {EM_PRODUCAO.map((titulo) => (
              <li key={titulo}>{titulo}</li>
            ))}
          </ul>
        </section>
      </DocsBody>
    </DocsPage>
  );
}
