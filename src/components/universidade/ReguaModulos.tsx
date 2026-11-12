'use client';

import { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';

export interface ItemRegua {
  /** id da seção na página (ex.: `tema-contatos`) */
  id: string;
  rotulo: string;
  /** tema ainda sem tutorial: pílula apagada, aponta pra "Em produção" */
  emProducao?: boolean;
}

/**
 * Régua de módulos do índice: uma pílula por tema, que rola até a seção. A pílula
 * do módulo em vista fica marcada (`aria-current`) e o marcador desliza entre as
 * pílulas (Motion, `layoutId`); com `prefers-reduced-motion` ele só troca de lugar.
 * No celular a régua rola de lado.
 */
export function ReguaModulos({ itens }: { itens: ItemRegua[] }) {
  const [ativo, setAtivo] = useState<string | null>(null);
  const reduzMovimento = useReducedMotion();
  const trilho = useRef<HTMLElement>(null);

  // no celular a régua rola de lado: a pílula do módulo em vista vem pro centro
  useEffect(() => {
    const nav = trilho.current;
    const atual = nav?.querySelector<HTMLElement>('a[aria-current="true"]');
    if (!nav || !atual || nav.scrollWidth <= nav.clientWidth) return;
    // posição pela caixa na tela: o `offsetLeft` é relativo ao <li>, não à régua
    const caixa = atual.getBoundingClientRect();
    const centro =
      nav.scrollLeft + caixa.left - nav.getBoundingClientRect().left + caixa.width / 2 - nav.clientWidth / 2;
    nav.scrollTo({ left: Math.max(0, centro), behavior: reduzMovimento ? 'auto' : 'smooth' });
  }, [ativo, reduzMovimento]);

  useEffect(() => {
    const ids = itens.map((i) => i.id);
    let pedido = 0;
    const medir = () => {
      pedido = 0;
      // logo abaixo da própria régua, que é fixa (a altura dela muda entre celular e desktop)
      const limite = (trilho.current?.getBoundingClientRect().bottom ?? 132) + 8;
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
      ref={trilho}
      aria-label="Módulos"
      className="not-prose sticky top-[calc(var(--fd-nav-height,0px)+var(--fd-tocnav-height,0px))] z-10 -mx-4 overflow-x-auto bg-fd-background/90 px-4 py-2 backdrop-blur [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] sm:mx-0 sm:px-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
    >
      <LayoutGroup id="regua-modulos">
        <ul className="flex w-max gap-2 py-1 sm:flex-wrap">
          {itens.map((item) => {
            const atual = !item.emProducao && ativo === item.id;
            return (
              <li key={`${item.id}-${item.rotulo}`} className="relative flex">
                {atual ? (
                  <motion.span
                    layoutId="regua-indicador"
                    data-indicador
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-fd-foreground"
                    transition={
                      reduzMovimento
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 420, damping: 38, mass: 0.6 }
                    }
                  />
                ) : null}
                <a
                  href={`#${item.id}`}
                  aria-current={atual ? 'true' : undefined}
                  className={
                    item.emProducao
                      ? 'relative inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dashed border-fd-border px-3.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring'
                      : 'relative inline-flex min-h-11 items-center rounded-full border border-fd-border bg-fd-background px-3.5 text-sm font-medium text-fd-muted-foreground transition-colors duration-300 hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring aria-[current=true]:border-transparent aria-[current=true]:bg-transparent aria-[current=true]:text-fd-background'
                  }
                >
                  {item.rotulo}
                  {item.emProducao ? <span className="text-xs">em produção</span> : null}
                </a>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
