'use client';

import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import s from './Marquee.module.css';

type Props = { children: ReactNode; className?: string; duracao?: string };

/**
 * Faixa horizontal com autoplay via CSS puro. Pausa no hover do mouse
 * (`:hover`, ver Marquee.module.css) e, separadamente, num toque
 * sustentado (`pointerdown` até `pointerup`/`pointercancel`/`pointerleave`),
 * já que `:hover` sozinho não é confiável em touch. As duas formas só
 * pausam, nunca uma desfaz a pausa da outra: cada uma solta sua própria
 * condição de saída, e soltar retoma na hora, sem atraso.
 *
 * O conteúdo é renderizado duas vezes lado a lado (a segunda cópia com
 * `aria-hidden`, só pra leitor de tela não repetir) pra a translação de
 * -50% fechar o laço sem costura. `prefers-reduced-motion` já é coberto
 * pelo corte global em `globals.css` (`animation-duration: 0.01ms
 * !important`).
 */
export function Marquee({ children, className, duracao = '96s' }: Props) {
  const [pausado, setPausado] = useState(false);

  return (
    <div className={[s.moldura, className].filter(Boolean).join(' ')}>
      <div
        className={s.trilho}
        data-pausado={pausado}
        style={{ '--duracao': duracao } as CSSProperties}
        onPointerDown={() => setPausado(true)}
        onPointerUp={() => setPausado(false)}
        onPointerCancel={() => setPausado(false)}
        onPointerLeave={() => setPausado(false)}
      >
        <div className={s.grupo}>{children}</div>
        <div className={s.grupo} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
