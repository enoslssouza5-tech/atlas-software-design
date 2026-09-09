'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { DUR, EASE } from '@/lib/motion-tokens';
import s from './Contador.module.css';

type Props = {
  /** null enquanto não houver número real confirmado pela Atlas */
  valor: number | null;
  rotulo: string;
  prefixo?: string;
  sufixo?: string;
  /** texto exibido no lugar do número enquanto o dado não existe */
  placeholder?: string;
};

/**
 * Contador do Ato 6.
 *
 * Se `valor` for null, NÃO inventa número: mostra o placeholder marcado.
 * Métrica só sobe na tela quando for verdadeira e verificável.
 */
export function Contador({ valor, rotulo, prefixo = '', sufixo = '', placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (valor === null) return;
      const alvo = ref.current?.querySelector(`.${s.numero}`);
      if (!alvo) return;

      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduzido) {
        alvo.textContent = `${prefixo}${valor}${sufixo}`;
        return;
      }

      const contagem = { n: 0 };
      gsap.to(contagem, {
        n: valor,
        duration: DUR.contador,
        ease: EASE.entrada,
        onUpdate: () => {
          alvo.textContent = `${prefixo}${Math.round(contagem.n)}${sufixo}`;
        },
        scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
      });
    },
    { scope: ref, dependencies: [valor, prefixo, sufixo] },
  );

  return (
    <div className={s.raiz} ref={ref}>
      {valor === null ? (
        <span className={s.placeholder}>{placeholder ?? '[MÉTRICA · a preencher]'}</span>
      ) : (
        <span className={s.numero}>{`${prefixo}0${sufixo}`}</span>
      )}
      <span className={s.rotulo}>{rotulo}</span>
    </div>
  );
}
