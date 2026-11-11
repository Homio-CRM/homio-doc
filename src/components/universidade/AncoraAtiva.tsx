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
      if (!alvo || !alvo.hasAttribute('data-clipe')) return;
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
