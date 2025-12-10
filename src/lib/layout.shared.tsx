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
  };
}
