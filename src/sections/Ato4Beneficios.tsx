'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { DIST, DUR, EASE, STAGGER } from '@/lib/motion-tokens';
import s from './Ato4Beneficios.module.css';

/**
 * ATO 4: BENEFÍCIOS
 *
 * Primeiro dos dois respiros claros da jornada. Depois de dois atos no preto
 * e de um trecho pinado, a página abre a cortina, e é justamente aqui que
 * ela para de falar de dor e passa a falar de método.
 *
 * Ícones em traço fino laranja. O acento nunca vira área preenchida.
 */

type Beneficio = {
  texto: string;
  icone: React.ReactNode;
};

const tracoComum = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.15,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const BENEFICIOS: Beneficio[] = [
  {
    texto:
      'Código seu. Sem trava de plataforma nem licença mensal pra continuar usando o que você já pagou.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M12 10 L5 16 L12 22" {...tracoComum} />
        <path d="M20 10 L27 16 L20 22" {...tracoComum} />
        <path d="M18 7 L14 25" {...tracoComum} />
      </svg>
    ),
  },
  {
    texto:
      'Sua equipe fala direto com quem constrói e com quem opera o anúncio, sem camada de atendimento repassando recado.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 8h22v14H14l-6 5v-5H5z" {...tracoComum} />
        <path d="M11 14h10M11 18h6" {...tracoComum} />
      </svg>
    ),
  },
  {
    texto:
      'Manutenção e ajuste ficam com a nossa equipe, sempre disponível depois da entrega. Sua equipe não precisa aprender a mexer em nada por conta própria.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 16a10 10 0 0 1 17-7" {...tracoComum} />
        <path d="M23 5v6h-6" {...tracoComum} />
        <path d="M26 16a10 10 0 0 1-17 7" {...tracoComum} />
        <path d="M9 27v-6h6" {...tracoComum} />
      </svg>
    ),
  },
  {
    texto:
      'Relatório real de performance e de custo por contato, medido na versão que foi pro ar, não numa promessa de proposta.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 24a12 12 0 0 1 24 0" {...tracoComum} />
        <path d="M16 24 L23 13" {...tracoComum} />
        <circle cx="16" cy="24" r="1.8" {...tracoComum} />
      </svg>
    ),
  },
  {
    texto:
      'Lead do anúncio caindo direto no seu fluxo, não se perdendo entre WhatsApp pessoal e memória de quem atendeu.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 6h22l-8 12v8l-6 3v-11z" {...tracoComum} />
      </svg>
    ),
  },
  {
    texto:
      'Estrutura pensada pra crescer, então adicionar uma automação ou uma área nova não obriga refazer o que já existe.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 27V17M13 27V11M21 27V20M29 27V6" {...tracoComum} />
      </svg>
    ),
  },
];

export function Ato4Beneficios() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        `.${s.item}`,
        { opacity: 0, y: DIST.medio },
        {
          opacity: 1,
          y: 0,
          duration: DUR.media,
          ease: EASE.entrada,
          stagger: STAGGER.padrao,
          scrollTrigger: { trigger: `.${s.grade}`, start: 'top 78%', once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <Ato id="ato-beneficios" numero="04" rotulo="O que muda" claro>
        <SplitWords
          texto="O diferencial não é o código. É o que sobra depois dele."
          como="h2"
          className={s.titulo}
        />

        <ul className={s.grade}>
          {BENEFICIOS.map((b) => (
            <li key={b.texto} className={s.item}>
              <span className={s.icone}>{b.icone}</span>
              <p className={s.itemTexto}>{b.texto}</p>
            </li>
          ))}
        </ul>
      </Ato>
    </div>
  );
}
