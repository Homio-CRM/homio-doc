import { docs } from '@/.source';
import { type InferPageType, loader } from 'fumadocs-core/source';
import * as LucideIcons from 'lucide-react';
import { createElement } from 'react';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(iconName) {
    if (!iconName) {
      return undefined;
    }

    const IconComponent = (LucideIcons as Record<string, any>)[iconName];
    if (IconComponent) {
      return createElement(IconComponent);
    }

    console.warn(`Ícone não encontrado: ${iconName}`);
    return undefined;
  },
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
