import { source } from '@/lib/source';
import { indiceBuscaTutorial, tutoriaisPublicados } from '@/lib/universidade';
import { createSearchAPI } from 'fumadocs-core/search/server';

// Um índice só, com a documentação em texto e os tutoriais da Universidade.
export const { GET } = createSearchAPI('advanced', {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
  indexes: async () => [
    ...source.getPages().map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    })),
    ...tutoriaisPublicados().map(indiceBuscaTutorial),
  ],
});
