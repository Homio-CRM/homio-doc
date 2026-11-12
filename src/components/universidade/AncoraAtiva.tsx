'use client';

import { useEffect } from 'react';

/**
 * Quando a URL chega com `#ancora` (link mandado pelo suporte), garante que a
 * seção certa fique visível depois do layout assentar e prepara o vídeo dela
 * (carrega os metadados, sem dar play). O destaque visual é CSS (`:target`).
 */
export function AncoraAtiva() {
  useEffect(() => {
    let timer: number | undefined;

    const aplicar = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const alvo = document.getElementById(id);
      // o sumário lateral aponta pro título (`#ancora-titulo`); troca pela âncora do
      // trecho, que é o link que se copia da barra de endereço e o que acende o destaque
      if (id.endsWith('-titulo') && !alvo?.hasAttribute('data-clipe')) {
        const trecho = document.getElementById(id.slice(0, -'-titulo'.length));
        if (trecho?.hasAttribute('data-clipe')) {
          window.location.replace(`#${trecho.id}`);
          return;
        }
      }
      if (!alvo || !alvo.hasAttribute('data-clipe')) return;
      // no celular a gravação não se lê: os passos em texto já chegam abertos
      if (window.matchMedia('(max-width: 639px)').matches) {
        alvo.querySelector('details')?.setAttribute('open', '');
      }
      const video = alvo.querySelector('video');
      if (video && video.preload === 'none') video.preload = 'metadata';
      // segunda rolagem, depois das fontes e do vídeo principal reservarem altura
      const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      timer = window.setTimeout(() => {
        alvo.scrollIntoView({ block: 'start', behavior: reduzMovimento ? 'auto' : 'smooth' });
      }, 120);
    };

    aplicar();
    window.addEventListener('hashchange', aplicar);
    return () => {
      window.removeEventListener('hashchange', aplicar);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
