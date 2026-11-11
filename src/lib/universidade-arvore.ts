import { createElement } from 'react';
import type { Node as PageTreeNode, Root as PageTreeRoot } from 'fumadocs-core/page-tree';
import { tutoriaisPorTema } from './universidade';
import { iconeLucide, temaInfo } from './universidade-temas';

/**
 * Árvore da barra lateral da Universidade: "Todos os tutoriais" e uma pasta por
 * tema, com ícone, contagem e os tutoriais dentro (título curto `menu`, se houver).
 *
 * Fica num arquivo próprio porque importa o lucide inteiro; `universidade.ts` é
 * usado também pela API e pela busca, que não precisam de ícone.
 */
export function arvoreUniversidade(): PageTreeRoot {
  const children: PageTreeNode[] = [
    { type: 'page', name: 'Todos os tutoriais', url: '/universidade', icon: iconeLucide('LayoutList') },
  ];
  for (const [tema, pages] of tutoriaisPorTema()) {
    children.push({
      type: 'folder',
      name: createElement(
        'span',
        { className: 'flex flex-1 items-center justify-between gap-2' },
        tema,
        createElement(
          'span',
          { className: 'text-xs tabular-nums text-fd-muted-foreground', 'aria-label': `${pages.length} tutoriais` },
          pages.length,
        ),
      ),
      icon: iconeLucide(temaInfo(tema).icone),
      defaultOpen: true,
      children: pages.map((p) => ({
        type: 'page',
        name: p.data.menu ?? p.data.title,
        url: p.url,
        icon: iconeLucide(p.data.icon),
      })),
    });
  }
  return { name: 'Universidade Homio', children };
}
