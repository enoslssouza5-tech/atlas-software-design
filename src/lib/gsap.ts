'use client';

/**
 * Ponto único de registro do GSAP.
 * Qualquer componente que anime importa daqui, nunca de 'gsap' direto,
 * pra garantir que os plugins estejam registrados uma só vez.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Lenis já entrega o scroll suavizado. O refresh automático do
  // ScrollTrigger em resize de barra de endereço no mobile causa
  // salto de layout, então desligamos o gatilho de resize vertical.
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (process.env.NODE_ENV !== 'production') {
    (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger, useGSAP };
