import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { arvoreUniversidade } from '@/lib/universidade';

export default function Layout({ children }: LayoutProps<'/universidade'>) {
  return (
    <DocsLayout tree={arvoreUniversidade()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
