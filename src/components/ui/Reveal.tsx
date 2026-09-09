'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import type { TagPermitida, TagRenderizavel } from '@/lib/tag-polimorfica';
import { gsap, useGSAP } from '@/lib/gsap';
import { DIST, DUR, EASE, STAGGER, TRIGGER_ENTRADA } from '@/lib/motion-tokens';

type Props = {
  children: ReactNode;
  como?: TagPermitida;
  className?: string;
  /** anima os filhos diretos em cascata, em vez do bloco inteiro */
  cascata?: boolean;
  distancia?: number;
  duracao?: number;
  atraso?: number;
  id?: string;
};

/**
 * Entrada vertical padrão da página: sobe entre 28px e 60px, power3.out,
 * nunca abaixo de 0.6s. É o tijolo de movimento mais usado do site.
 */
export function Reveal({
  children,
  como = 'div',
  className,
  cascata = false,
  distancia = DIST.medio,
  duracao = DUR.media,
  atraso = 0,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = como as unknown as TagRenderizavel;

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;

      const alvos = cascata ? Array.from(raiz.children) : [raiz];
      if (!alvos.length) return;

      gsap.fromTo(
        alvos,
        { opacity: 0, y: distancia },
        {
          opacity: 1,
          y: 0,
          duration: duracao,
          ease: EASE.entrada,
          stagger: cascata ? STAGGER.padrao : 0,
          delay: atraso,
          scrollTrigger: { trigger: raiz, start: TRIGGER_ENTRADA, once: true },
        },
      );
    },
    { scope: ref, dependencies: [cascata, distancia, duracao, atraso] },
  );

  return (
    <Tag ref={ref} id={id} className={className} data-anim={cascata ? undefined : 'fade-up'}>
      {children}
    </Tag>
  );
}
