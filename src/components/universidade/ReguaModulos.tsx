'use client';

import { useEffect, useState } from 'react';

export interface ItemRegua {
  /** id da seção na página (ex.: `tema-contatos`) */
  id: string;
  rotulo: string;
  /** tema ainda sem tutorial: pílula apagada, aponta pra "Em produção" */
  emProducao?: boolean;
}

/**
 * Régua de módulos do índice: uma pílula por tema, que rola até a seção. A pílula
 * do módulo em vista fica marcada (`aria-current`). No celular a régua rola de lado.
 */
export function ReguaModulos({ itens }: { itens: ItemRegua[] }) {
  const [ativo, setAtivo] = useState<string | null>(null);

  useEffect(() => {
    const ids = itens.map((i) => i.id);
    let pedido = 0;
    const medir = () => {
      pedido = 0;
      const limite = 140; // abaixo do cabeçalho fixo
      let atual: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= limite) atual = id;
      }
      setAtivo(atual);
    };
    const aoRolar = () => {
      if (!pedido) pedido = window.requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      if (pedido) window.cancelAnimationFrame(pedido);
    };
  }, [itens]);

  return (
    <nav
      aria-label="Módulos"
      className="not-prose -mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-2 py-1 sm:flex-wrap">
        {itens.map((item) => {
          const atual = !item.emProducao && ativo === item.id;
          return (
            <li key={`${item.id}-${item.rotulo}`}>
              <a
                href={`#${item.id}`}
                aria-current={atual ? 'true' : undefined}
                className={
                  item.emProducao
                    ? 'inline-flex min-h-9 items-center gap-1.5 rounded-full border border-dashed border-fd-border px-3.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring'
                    : 'inline-flex min-h-9 items-center rounded-full border border-fd-border bg-fd-background px-3.5 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring aria-[current=true]:border-fd-foreground aria-[current=true]:bg-fd-foreground aria-[current=true]:text-fd-background'
                }
              >
                {item.rotulo}
                {item.emProducao ? <span className="text-xs">em produção</span> : null}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
