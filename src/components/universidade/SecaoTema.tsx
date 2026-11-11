'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface Props {
  id: string;
  rotuladaPor: string;
  className?: string;
  children: ReactNode;
}

/**
 * Seção de módulo do índice com um subir discreto (10 px) ao entrar na tela, uma
 * vez só. O conteúdo já está visível em repouso: só a posição anima, nunca a
 * opacidade. Com `prefers-reduced-motion`, nada se move.
 */
export function SecaoTema({ id, rotuladaPor, className, children }: Props) {
  const reduzMovimento = useReducedMotion();
  return (
    <motion.section
      id={id}
      aria-labelledby={rotuladaPor}
      className={className}
      initial={reduzMovimento ? false : { y: 10 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: 'spring', stiffness: 140, damping: 22, mass: 0.8 }}
    >
      {children}
    </motion.section>
  );
}
