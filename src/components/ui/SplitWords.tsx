'use client';

import { Fragment, useRef } from 'react';
import type { TagPermitida, TagRenderizavel } from '@/lib/tag-polimorfica';
import { gsap, useGSAP } from '@/lib/gsap';
import { DUR, EASE, STAGGER, TRIGGER_ENTRADA } from '@/lib/motion-tokens';
import s from './SplitWords.module.css';

type Props = {
  texto: string;
  como?: TagPermitida;
  className?: string;
  /** atraso antes da primeira palavra, o silêncio do Ato 1 mora aqui */
  atraso?: number;
  /** dispara no scroll (padrão) ou imediatamente, quando quem manda é uma timeline de fora */
  gatilho?: 'scroll' | 'imediato' | 'nenhum';
  id?: string;
};

/**
 * Revelação palavra por palavra com clip-path inset 100% → 0%.
 * As palavras sobem de dentro da própria linha, não de fora da tela:
 * é corte de câmera, não elemento voando.
 */
export function SplitWords({
  texto,
  como = 'h2',
  className,
  atraso = 0,
  gatilho = 'scroll',
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const palavras = texto.split(' ');
  const Tag = como as unknown as TagRenderizavel;

  useGSAP(
    () => {
      if (gatilho === 'nenhum') return;
      const alvos = ref.current?.querySelectorAll(`.${s.interna}`);
      if (!alvos?.length) return;

      gsap.fromTo(
        alvos,
        { clipPath: 'inset(100% 0% 0% 0%)', yPercent: 24 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          yPercent: 0,
          duration: DUR.longa,
          ease: EASE.entrada,
          stagger: STAGGER.apertado,
          delay: atraso,
          scrollTrigger:
            gatilho === 'scroll'
              ? { trigger: ref.current, start: TRIGGER_ENTRADA, once: true }
              : undefined,
        },
      );
    },
    { scope: ref, dependencies: [texto, gatilho, atraso] },
  );

  return (
    <Tag
      ref={ref}
      id={id}
      className={[s.raiz, className].filter(Boolean).join(' ')}
      data-anim="clip"
    >
      {palavras.map((palavra, i) => (
        <Fragment key={`${palavra}-${i}`}>
          <span className={s.mascara}>
            <span className={s.interna}>{palavra}</span>
          </span>
          {/* O espaço fica FORA da máscara. Dentro de um inline-block com
              overflow hidden ele é engolido, e as palavras saem coladas. */}
          {i < palavras.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
