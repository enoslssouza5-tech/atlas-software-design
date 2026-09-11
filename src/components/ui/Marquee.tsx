'use client';

import type { CSSProperties, ReactNode } from 'react';
import s from './Marquee.module.css';

type Props = { children: ReactNode; className?: string; duracao?: string };

/**
 * Faixa horizontal com autoplay via CSS puro, pausa no hover. O conteúdo é
 * renderizado duas vezes lado a lado (a segunda cópia com `aria-hidden`, só
 * pra leitor de tela não repetir) pra a translação de -50% fechar o laço
 * sem costura. `prefers-reduced-motion` já é coberto pelo corte global em
 * `globals.css` (`animation-duration: 0.01ms !important`).
 */
export function Marquee({ children, className, duracao = '52s' }: Props) {
  return (
    <div className={[s.moldura, className].filter(Boolean).join(' ')}>
      <div className={s.trilho} style={{ '--duracao': duracao } as CSSProperties}>
        <div className={s.grupo}>{children}</div>
        <div className={s.grupo} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
