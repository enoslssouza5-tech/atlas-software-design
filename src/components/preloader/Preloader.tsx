'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useLenis } from '@/providers/LenisProvider';
import { useAbertura } from '@/providers/AberturaProvider';
import { MarcaA } from '@/components/ui/MarcaA';
import { EASE } from '@/lib/motion-tokens';
import s from './Preloader.module.css';

const CHAVE_SESSAO = 'atlas:visitou';
/** teto duro. Nem em 3G ruim o preloader passa disso. */
const TETO_MS = 2500;

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [saiu, setSaiu] = useState(false);
  const { travar } = useLenis();
  const { liberar } = useAbertura();

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;

      const concluir = () => {
        // quem desarma o failsafe é o LenisProvider, assim que a camada de
        // motion sobe, bem antes daqui
        try {
          sessionStorage.setItem(CHAVE_SESSAO, '1');
        } catch {
          /* modo privado bloqueia storage, só significa que repete na próxima */
        }
        travar(false);
        liberar();
        setSaiu(true);
      };

      // A abertura do Ato 1 começa junto com a cortina subindo, não depois
      // dela. Esperar a cortina terminar empurrava o CTA pra quase 5s de
      // página, e faz a cortina parecer estar revelando uma tela vazia.
      const liberarCedo = () => {
        travar(false);
        liberar();
      };

      let jaVisitou = false;
      try {
        jaVisitou = sessionStorage.getItem(CHAVE_SESSAO) === '1';
      } catch {
        jaVisitou = false;
      }

      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Segunda visita na mesma sessão, ou usuário que pediu menos movimento:
      // a cortina nem chega a aparecer.
      if (jaVisitou || reduzido) {
        concluir();
        return;
      }

      travar(true);
      window.scrollTo(0, 0);

      const traco = raiz.querySelectorAll<SVGPathElement>('path');
      traco.forEach((p) => {
        const comprimento = p.getTotalLength();
        gsap.set(p, { strokeDasharray: comprimento, strokeDashoffset: comprimento });
      });

      const tl = gsap.timeline({ onComplete: concluir });

      tl.to(traco, {
        strokeDashoffset: 0,
        duration: 0.86,
        ease: EASE.entrada,
        stagger: 0.12,
      })
        .fromTo(
          `.${s.saudacao}`,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.62, ease: EASE.entrada },
          '-=0.34',
        )
        .to(`.${s.saudacao}`, { opacity: 0, duration: 0.38, ease: 'power2.in' }, '+=0.32')
        .to(`.${s.marca}`, { opacity: 0, scale: 0.94, duration: 0.42, ease: 'power2.in' }, '<')
        .to(
          raiz,
          { yPercent: -100, duration: 0.62, ease: EASE.entrada, onStart: liberarCedo },
          '-=0.12',
        );

      // Teto duro: se a timeline travar por qualquer motivo, a cortina sobe.
      const teto = window.setTimeout(() => {
        if (tl.isActive()) {
          tl.kill();
          gsap.to(raiz, { yPercent: -100, duration: 0.42, ease: EASE.entrada, onComplete: concluir });
        }
      }, TETO_MS);

      return () => {
        clearTimeout(teto);
        travar(false);
      };
    },
    { scope: ref },
  );

  if (saiu) return null;

  return (
    <div className={s.raiz} ref={ref} id="preloader" aria-hidden="true">
      <div className={s.centro}>
        <MarcaA className={s.marca} tracado />
        <p className={s.saudacao}>
          Atlas Software <span className={s.amp}>&amp;</span> Design
        </p>
      </div>
    </div>
  );
}
