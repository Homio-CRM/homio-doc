import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { arvoreUniversidade } from '@/lib/universidade-arvore';
import { ModoSuporte } from '@/components/universidade/ModoSuporte';

export default function Layout({ children }: LayoutProps<'/universidade'>) {
  return (
    <DocsLayout tree={arvoreUniversidade()} {...baseOptions()}>
      <a
        href="#nd-page"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-fd-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-fd-foreground focus:outline-2 focus:outline-fd-ring"
      >
        Pular para o conteúdo
      </a>
      <ModoSuporte />
      {children}
    </DocsLayout>
  );
}
