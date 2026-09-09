'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { Contador } from '@/components/ui/Contador';
import { Placeholder } from '@/components/ui/Placeholder';
import s from './Ato6ProvaSocial.module.css';

/**
 * ATO 6 — PROVA SOCIAL
 *
 * A seção está construída e vazia de propósito.
 *
 * Métrica só aparece se for verdadeira e verificável; depoimento só entra
 * real e com consentimento de quem falou. Enquanto a Atlas não fornecer os
 * dados, os contadores ficam em placeholder e o espaço do depoimento fica
 * reservado — nunca preenchido com texto plausível.
 */

const METRICAS = [
  { rotulo: 'Projetos entregues', placeholder: '[MÉTRICA · nº real de entregas]' },
  { rotulo: 'Anos de operação', placeholder: '[MÉTRICA · ano de fundação]' },
  { rotulo: 'Clientes ativos hoje', placeholder: '[MÉTRICA · carteira atual]' },
];

export function Ato6ProvaSocial() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduzido) return;

      // parallax de fundo: a camada corre mais devagar que a página
      gsap.fromTo(
        `.${s.fundo}`,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={s.envoltorio}>
      <div className={s.fundo} aria-hidden="true" />
      <Ato id="ato-prova" numero="06" rotulo="Prova">
        <SplitWords
          texto="Aqui entram os números — quando forem verificáveis."
          como="h2"
          className={s.titulo}
        />

        <p className={s.explicacao}>
          Esta seção fica vazia até a Atlas fornecer dados reais. Preferimos um espaço
          reservado a um número redondo que ninguém consegue comprovar.
        </p>

        <div className={s.metricas}>
          {METRICAS.map((m) => (
            <Contador key={m.rotulo} valor={null} rotulo={m.rotulo} placeholder={m.placeholder} />
          ))}
        </div>

        <figure className={s.depoimento}>
          <blockquote className={s.aspas}>
            <Placeholder bloco>
              [DEPOIMENTO · aguardando cliente real e consentimento por escrito. Não
              publicar nada neste espaço antes disso]
            </Placeholder>
          </blockquote>
          <figcaption className={s.assinatura}>
            <span className={s.avatar} aria-hidden="true" />
            <span>
              <Placeholder>[NOME · cliente]</Placeholder>
            </span>
          </figcaption>
        </figure>
      </Ato>
    </div>
  );
}
