'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

type LenisContexto = {
  lenis: Lenis | null;
  /** rolar até um elemento pelo id, respeitando o mesmo sistema de scroll */
  irPara: (alvo: string) => void;
  travar: (travado: boolean) => void;
};

const Ctx = createContext<LenisContexto>({
  lenis: null,
  irPara: () => {},
  travar: () => {},
});

export const useLenis = () => useContext(Ctx);

/**
 * Única instância de Lenis do projeto inteiro.
 *
 * Lenis é a fonte do scroll, o GSAP ticker é o relógio e o ScrollTrigger só
 * escuta. Nunca existe window.addEventListener('scroll') em lugar nenhum:
 * dois sistemas de scroll competindo é a origem clássica de jitter em pin.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);
  const [, setPronto] = useState(false);

  useEffect(() => {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      // lerp 1 = sem suavização. Mantém UM sistema de scroll mesmo quando o
      // usuário pediu menos movimento, em vez de desligar o Lenis e deixar
      // o ScrollTrigger órfão.
      lerp: reduzido ? 1 : 0.096,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: !reduzido,
      autoRaf: false,
    });

    ref.current = lenis;

    // Lenis de pé + GSAP registrado = a camada de motion subiu. É aqui que o
    // failsafe do <head> é desarmado, e não no fim do preloader: o failsafe
    // existe pra cobrir JS que não carregou, não pra correr contra a
    // duração de uma animação de abertura.
    window.__atlasReady = true;
    if (window.__atlasFailsafe) {
      clearTimeout(window.__atlasFailsafe);
      window.__atlasFailsafe = undefined;
    }

    const aoRolar = () => ScrollTrigger.update();
    lenis.on('scroll', aoRolar);

    const tick = (tempo: number) => lenis.raf(tempo * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Sem scrollerProxy de propósito: o Lenis rola a window de verdade, e o
    // ScrollTrigger mede a window melhor do que qualquer proxy parcial.
    // Um proxy só com scrollTop deixava start/end desalinhados dos pins.

    setPronto(true);

    // Qualquer coisa que mude a altura do documento invalida start/end de
    // todo mundo: fontes que trocam de fallback pro arquivo real, imagens
    // que chegam, pins criados tarde. Um refresh em cada um desses marcos
    // custa pouco e evita gatilho disparando na seção errada.
    const refrescar = () => ScrollTrigger.refresh();
    const quadro = requestAnimationFrame(() => requestAnimationFrame(refrescar));
    // Rede tardia: pins que dependem de estado assíncrono (o device tier do
    // carrossel, por exemplo) só existem alguns ciclos depois da montagem.
    const tardio = window.setTimeout(refrescar, 700);
    window.addEventListener('load', refrescar);
    if (document.fonts) void document.fonts.ready.then(refrescar);

    return () => {
      cancelAnimationFrame(quadro);
      clearTimeout(tardio);
      window.removeEventListener('load', refrescar);
      lenis.off('scroll', aoRolar);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      ref.current = null;
    };
  }, []);

  const valor: LenisContexto = {
    lenis: ref.current,
    irPara: (alvo) => {
      const el = document.querySelector(alvo);
      if (el) ref.current?.scrollTo(el as HTMLElement, { offset: 0 });
    },
    travar: (travado) => {
      if (travado) ref.current?.stop();
      else ref.current?.start();
    },
  };

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
