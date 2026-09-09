/**
 * Vocabulário de movimento da Atlas.
 *
 * Regra do CLAUDE.md: ease de entrada é sempre power3.out, loop é sine.inOut,
 * duração de entrada nunca abaixo de 0.6s nem em número redondo, translateY
 * entre 28px e 60px, stagger entre 0.08s e 0.12s.
 *
 * Nenhum componente escreve duração ou ease na mão. Tudo sai daqui.
 */

export const EASE = {
  entrada: 'power3.out',
  saida: 'power2.in',
  loop: 'sine.inOut',
  scrub: 'none',
} as const;

export const DUR = {
  /** entradas — nunca abaixo de 0.6s, nunca redondas */
  curta: 0.64,
  media: 0.82,
  longa: 1.14,
  epica: 1.46,
  /** contadores do Ato 6 */
  contador: 1.68,
  /** micro-interação de hover — única faixa abaixo de 0.25s */
  hover: 0.22,
} as const;

export const DIST = {
  /** translateY de entrada — mínimo 28px, máximo 60px */
  curto: 28,
  medio: 42,
  longo: 60,
} as const;

export const STAGGER = {
  apertado: 0.08,
  padrao: 0.1,
  solto: 0.12,
} as const;

/** Silêncio antes do movimento. É design, não atraso acidental. */
export const SILENCIO = {
  hero: 0.4,
  secao: 0.12,
} as const;

/** Início padrão de ScrollTrigger para entradas de seção. */
export const TRIGGER_ENTRADA = 'top 78%';

/** Estado inicial de uma entrada vertical. */
export function de(y: number = DIST.medio) {
  return { opacity: 0, y };
}

/** Estado final de uma entrada vertical. */
export function para(duration: number = DUR.media) {
  return { opacity: 1, y: 0, duration, ease: EASE.entrada };
}
