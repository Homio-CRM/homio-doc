'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Link2 } from 'lucide-react';

interface Props {
  url: string;
  /** o que vai no aria-label; o texto visível é "Copiar link" */
  descricao: string;
  /** só o ícone, pra caber na linha de um resultado de busca */
  compacto?: boolean;
}

/**
 * Botão pra equipe de suporte: copia a URL do trecho (com âncora) e confirma por
 * 1,8 s. Sem clipboard (http, permissão negada) cai pra seleção manual do link.
 */
export function CopiarLink({ url, descricao, compacto = false }: Props) {
  const [estado, setEstado] = useState<'pronto' | 'copiado' | 'falhou'>('pronto');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url);
      setEstado('copiado');
    } catch {
      setEstado('falhou');
      window.prompt('Copie o link:', url);
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setEstado('pronto'), 1800);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={`Copiar link de: ${descricao}`}
      title={compacto ? 'Copiar link' : undefined}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-fd-border bg-fd-background text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring dark:bg-fd-muted ${compacto ? 'size-11 sm:size-9' : 'min-h-11 px-3 py-1.5 sm:min-h-9'}`}
    >
      {estado === 'copiado' ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Link2 className="size-4" aria-hidden />
      )}
      <span aria-live="polite" className={compacto ? 'sr-only' : undefined}>
        {estado === 'copiado' ? 'Link copiado' : 'Copiar link'}
      </span>
    </button>
  );
}
