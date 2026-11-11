'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, MessageSquareText } from 'lucide-react';
import { EVENTO_SUPORTE, modoSuporteAtivo } from './ModoSuporte';

interface Props {
  /** a resposta pronta do catálogo, já com o link do trecho */
  texto: string;
  descricao: string;
}

/**
 * Botão da equipe de suporte: copia a resposta pronta do trecho (texto + link),
 * a mesma que o agente de IA usa. Só aparece com o modo suporte ligado neste
 * navegador (abrir qualquer página da Universidade com `?suporte=1`).
 */
export function CopiarResposta({ texto, descricao }: Props) {
  const [ativo, setAtivo] = useState(false);
  const [estado, setEstado] = useState<'pronto' | 'copiado'>('pronto');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const ler = () => setAtivo(modoSuporteAtivo());
    ler();
    window.addEventListener(EVENTO_SUPORTE, ler);
    window.addEventListener('storage', ler);
    return () => {
      window.removeEventListener(EVENTO_SUPORTE, ler);
      window.removeEventListener('storage', ler);
      window.clearTimeout(timer.current);
    };
  }, []);

  if (!ativo) return null;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setEstado('copiado');
    } catch {
      window.prompt('Copie a resposta:', texto);
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setEstado('pronto'), 1800);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={`Copiar resposta pronta de: ${descricao}`}
      title={texto}
      className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
    >
      {estado === 'copiado' ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <MessageSquareText className="size-4" aria-hidden />
      )}
      <span aria-live="polite">{estado === 'copiado' ? 'Resposta copiada' : 'Copiar resposta pronta'}</span>
    </button>
  );
}
