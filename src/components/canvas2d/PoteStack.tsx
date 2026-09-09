'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useDeviceTier } from '@/lib/use-device-tier';
import { FERRAMENTAS, LIMITE_MOBILE } from './ferramentas';
import { criarPote, type Pote } from './pote-engine';
import s from './PoteStack.module.css';

/**
 * Ponte React ↔ Canvas 2D.
 *
 * O componente não desenha nada: ele monta a engine, entrega o brilho do
 * vidro vindo do ScrollTrigger e garante o cleanup. Toda a física vive fora
 * do React de propósito — 60 renders por segundo pra mover bolinha seria o
 * jeito mais caro possível de fazer isso.
 */
export function PoteStack() {
  const secaoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poteRef = useRef<Pote | null>(null);
  const tier = useDeviceTier();

  useEffect(() => {
    if (!tier.pronto) return;
    const secao = secaoRef.current;
    const canvas = canvasRef.current;
    if (!secao || !canvas) return;

    const ferramentas = tier.mobile ? FERRAMENTAS.slice(0, LIMITE_MOBILE) : FERRAMENTAS;

    const pote = criarPote(canvas, secao, {
      ferramentas,
      reduzido: tier.reduzido,
    });
    poteRef.current = pote;

    // O brilho do vidro segue a seção cruzando a viewport. Vem do
    // ScrollTrigger porque Lenis é o único dono do scroll da página.
    const st = ScrollTrigger.create({
      trigger: secao,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => pote.definirLuz(self.progress * 2 - 1),
    });

    return () => {
      st.kill();
      pote.destruir();
      poteRef.current = null;
    };
  }, [tier.pronto, tier.mobile, tier.reduzido]);

  const visiveis = tier.mobile ? FERRAMENTAS.slice(0, LIMITE_MOBILE) : FERRAMENTAS;

  return (
    <div className={s.raiz} ref={secaoRef}>
      <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />

      {/* O canvas é decorativo. A informação real fica em texto, legível por
          leitor de tela e por quem tem o JS bloqueado. */}
      <ul className={s.lista}>
        {visiveis.map((f) => (
          <li key={f.rotulo} className={s.item}>
            <span className={s.ponto} style={{ background: f.cor }} aria-hidden="true" />
            {f.rotulo}
          </li>
        ))}
      </ul>
    </div>
  );
}
