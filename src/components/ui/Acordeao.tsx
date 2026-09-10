'use client';

import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { DUR, EASE } from '@/lib/motion-tokens';
import s from './Acordeao.module.css';

export type ItemFaq = { pergunta: string; resposta: string };

type Props = { itens: ItemFaq[]; idBase?: string };

/**
 * FAQ em acordeão. A altura é animada pelo GSAP (height: auto real),
 * nunca por max-height CSS: max-height chutado sempre entrega um corte
 * seco no fim da transição.
 */
export function Acordeao({ itens, idBase = 'faq' }: Props) {
  const [aberto, setAberto] = useState<number | null>(null);
  const corpos = useRef<(HTMLDivElement | null)[]>([]);

  const alternar = (i: number) => {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fechando = aberto === i;
    const proximo = fechando ? null : i;

    // fecha o que estava aberto
    if (aberto !== null && aberto !== i) {
      const anterior = corpos.current[aberto];
      if (anterior) {
        gsap.to(anterior, {
          height: 0,
          opacity: 0,
          duration: reduzido ? 0 : DUR.curta,
          ease: EASE.entrada,
        });
      }
    }

    const alvo = corpos.current[i];
    if (alvo) {
      gsap.killTweensOf(alvo);
      if (fechando) {
        gsap.to(alvo, {
          height: 0,
          opacity: 0,
          duration: reduzido ? 0 : DUR.curta,
          ease: EASE.entrada,
        });
      } else {
        gsap.to(alvo, {
          height: 'auto',
          opacity: 1,
          duration: reduzido ? 0 : DUR.media,
          ease: EASE.entrada,
        });
      }
    }

    setAberto(proximo);
  };

  return (
    <div className={s.raiz}>
      {itens.map((item, i) => {
        const estaAberto = aberto === i;
        return (
          <div key={item.pergunta} className={s.item} data-aberto={estaAberto}>
            <h3 className={s.cabecalho}>
              <button
                type="button"
                className={s.gatilho}
                onClick={() => alternar(i)}
                aria-expanded={estaAberto}
                aria-controls={`${idBase}-corpo-${i}`}
                id={`${idBase}-botao-${i}`}
              >
                <span className={s.pergunta}>{item.pergunta}</span>
                <span className={s.cruz} aria-hidden="true">
                  <span />
                  <span />
                </span>
              </button>
            </h3>
            <div
              id={`${idBase}-corpo-${i}`}
              role="region"
              aria-labelledby={`${idBase}-botao-${i}`}
              ref={(el) => {
                corpos.current[i] = el;
              }}
              className={s.corpo}
              hidden={false}
            >
              <p className={s.resposta}>{item.resposta}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
