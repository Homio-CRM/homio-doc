import { createElement, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

/**
 * O que cada tema (módulo) da Universidade carrega além dos tutoriais: ícone e a
 * página da documentação em texto que cobre o mesmo assunto. Tema sem entrada aqui
 * ganha o ícone genérico e fica sem o link "Ler em texto".
 */
export interface Tema {
  /** nome do ícone no lucide-react */
  icone: string;
  /** página de /docs com o mesmo assunto */
  doc?: string;
}

export const TEMAS: Record<string, Tema> = {
  'WhatsApp Homio': { icone: 'MessageCircle', doc: '/docs/whatsapp' },
  Contatos: { icone: 'Users', doc: '/docs/contatos' },
  'Oportunidades e funil': { icone: 'Kanban', doc: '/docs/oportunidades' },
  Automações: { icone: 'Workflow', doc: '/docs/automacoes' },
  Conversas: { icone: 'MessagesSquare', doc: '/docs/conversas' },
};

export function temaInfo(tema: string): Tema {
  return TEMAS[tema] ?? { icone: 'Folder' };
}

/** Ícone do lucide pelo nome (como o `icon` do frontmatter); `undefined` se não existir. */
export function iconeLucide(nome?: string, props?: LucideProps): ReactNode {
  if (!nome) return undefined;
  const Icone = (LucideIcons as unknown as Record<string, LucideIcon | undefined>)[nome];
  return Icone ? createElement(Icone, props) : undefined;
}
