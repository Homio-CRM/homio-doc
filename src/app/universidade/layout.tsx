import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { arvoreUniversidade } from '@/lib/universidade-arvore';
import { ModoSuporte } from '@/components/universidade/ModoSuporte';

export default function Layout({ children }: LayoutProps<'/universidade'>) {
  return (
    <DocsLayout tree={arvoreUniversidade()} {...baseOptions()}>
      <ModoSuporte />
      {children}
    </DocsLayout>
  );
}
