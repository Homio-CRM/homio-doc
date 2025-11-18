import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Homio',
      url: '/',
    },
    search: {
      enabled: true,
    },
  };
}
