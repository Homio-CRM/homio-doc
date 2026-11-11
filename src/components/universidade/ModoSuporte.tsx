'use client';

import { useEffect } from 'react';

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

/**
 * Liga o modo suporte pela URL (`?suporte=1`) e guarda no navegador; `?suporte=0`
 * desliga. Quem está em modo suporte vê, em cada trecho, o botão "Copiar resposta
 * pronta". O cliente nunca vê: o parâmetro só circula na equipe.
 */
export function ModoSuporte() {
  useEffect(() => {
    const valor = new URLSearchParams(window.location.search).get('suporte');
    if (valor !== '1' && valor !== '0') return;
    try {
      if (valor === '1') window.localStorage.setItem(CHAVE_SUPORTE, '1');
      else window.localStorage.removeItem(CHAVE_SUPORTE);
    } catch {
      // sem localStorage (modo privado restrito): o modo vale só nesta página
    }
    window.dispatchEvent(new Event(EVENTO_SUPORTE));
  }, []);
  return null;
}
