'use client';

import { useEffect, useState } from 'react';
import { Headset, X } from 'lucide-react';

/** chave no localStorage; `1` = modo suporte ligado neste navegador */
export const CHAVE_SUPORTE = 'universidade.suporte';
/** evento disparado quando o modo muda, pra quem renderiza controles de suporte */
export const EVENTO_SUPORTE = 'universidade:suporte';

export function modoSuporteAtivo(): boolean {
  try {
    return window.localStorage.getItem(CHAVE_SUPORTE) === '1';
  } catch {
    return false;
  }
}

function gravar(ligado: boolean) {
  try {
    if (ligado) window.localStorage.setItem(CHAVE_SUPORTE, '1');
    else window.localStorage.removeItem(CHAVE_SUPORTE);
  } catch {
    // sem localStorage (modo privado restrito): o modo vale só nesta página
  }
  window.dispatchEvent(new Event(EVENTO_SUPORTE));
}

/**
 * Liga o modo suporte pela URL (`?suporte=1`) e guarda no navegador; `?suporte=0`
 * desliga. Com ele ligado, cada trecho ganha "Copiar resposta pronta" e aparece
 * uma pílula fixa dizendo que o modo está ligado, com o botão de desligar. O
 * cliente nunca vê: o parâmetro só circula na equipe.
 */
export function ModoSuporte() {
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const valor = new URLSearchParams(window.location.search).get('suporte');
    if (valor === '1' || valor === '0') gravar(valor === '1');
    const ler = () => setAtivo(modoSuporteAtivo());
    ler();
    window.addEventListener(EVENTO_SUPORTE, ler);
    window.addEventListener('storage', ler);
    return () => {
      window.removeEventListener(EVENTO_SUPORTE, ler);
      window.removeEventListener('storage', ler);
    };
  }, []);

  // reserva o rodapé da página pra pílula fixa não cobrir o último link
  useEffect(() => {
    document.body.classList.toggle('suporte-ativo', ativo);
    return () => document.body.classList.remove('suporte-ativo');
  }, [ativo]);

  if (!ativo) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-background/95 py-1.5 pl-3 pr-1.5 text-xs font-medium text-fd-foreground shadow-md backdrop-blur"
    >
      <Headset className="size-3.5 text-fd-primary" aria-hidden />
      Modo suporte
      <button
        type="button"
        onClick={() => gravar(false)}
        aria-label="Desligar o modo suporte"
        className="inline-flex size-8 items-center justify-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
