import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { NavChildren } from '@/components/NavChildren';
import { DynamicLogo } from '@/components/DynamicLogo';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      enabled: true,
      title: <DynamicLogo />,
      url: undefined,
      children: <NavChildren />,
    },
    links: [
      { text: 'Documentação', url: '/docs', active: 'nested-url' },
      { text: 'Universidade', url: '/universidade', active: 'nested-url' },
    ],
  };
}
