'use client';

import { Reveal } from './Reveal';
import { DIST, DUR } from '@/lib/motion-tokens';
import s from './Eyebrow.module.css';

/**
 * Rótulo curto acima do H2 de uma seção, no padrão pequeno e uppercase de
 * eyebrow de landing page. Some da marcação numerada do Ato, que continua
 * existindo como está: este é um elemento novo, só de leitura rápida.
 */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Reveal como="p" className={s.raiz} distancia={DIST.curto} duracao={DUR.curta}>
      {children}
    </Reveal>
  );
}
