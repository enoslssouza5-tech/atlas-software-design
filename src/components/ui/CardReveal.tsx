'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import type { TagPermitida, TagRenderizavel } from '@/lib/tag-polimorfica';
import { gsap, useGSAP } from '@/lib/gsap';
import { DUR, EASE, TRIGGER_ENTRADA } from '@/lib/motion-tokens';
import s from './CardReveal.module.css';

type Props = {
  children: ReactNode;
  como?: TagPermitida;
  className?: string;
  duracao?: number;
  id?: string;
};

/**
 * Card que nasce reduzido e transparente (scale 0.85, opacity 0) e cresce
 * pra escala 1 conforme entra na área visível, disparado uma única vez. A
 * ênfase vem do próprio card entrando em cena, não de destaque tipográfico
 * no texto por dentro dele.
 */
export function CardReveal({ children, como = 'div', className, duracao = DUR.longa, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = como as unknown as TagRenderizavel;

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;

      gsap.fromTo(
        raiz,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: duracao,
          ease: EASE.entrada,
          scrollTrigger: { trigger: raiz, start: TRIGGER_ENTRADA, once: true },
        },
      );
    },
    { scope: ref, dependencies: [duracao] },
  );

  return (
    <Tag ref={ref} id={id} className={[s.cartao, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
