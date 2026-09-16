'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { SplitWords } from '@/components/ui/SplitWords';
import { ImagesScrollingAnimation } from '@/components/ui/ImagesScrollingAnimation';
import { DUR, EASE } from '@/lib/motion-tokens';
import s from './Ato5Projetos.module.css';

export function Ato5Projetos() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.' + s.cabecalho,
        { opacity: 0, y: 42 },
        {
          opacity: 1,
          y: 0,
          duration: DUR.media,
          ease: EASE.entrada,
          scrollTrigger: { trigger: '.' + s.cabecalho, start: 'top 82%', once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section className={s.raiz} id="ato-projetos" ref={ref} aria-labelledby="ato-projetos-rotulo">
      <div className={s.palco}>
        <div className={`container ${s.cabecalho}`}>
          <span className="sr-only" id="ato-projetos-rotulo">
            Projetos
          </span>
          <SplitWords
            texto="Nossos projetos"
            como="h2"
            className={s.titulo}
          />
        </div>

        <div className={`container ${s.composicao}`}>
          <ImagesScrollingAnimation />
        </div>
      </div>
    </section>
  );
}
