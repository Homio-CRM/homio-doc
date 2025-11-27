import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { NavChildren } from '@/components/NavChildren';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      enabled: true,
      title: null,
      url: undefined,
      children: <NavChildren />,
    },
  };
}
