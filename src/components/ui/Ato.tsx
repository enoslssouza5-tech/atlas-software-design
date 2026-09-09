'use client';

import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import s from './Ato.module.css';

type Props = {
  id: string;
  /** numeral do ato, exibido como marcação de roteiro */
  numero: string;
  /** nome do ato — some visualmente quando `rotuloOculto`, nunca do DOM */
  rotulo: string;
  children: ReactNode;
  /** fundo claro: usado em 1 ou 2 momentos da jornada, nunca alternado */
  claro?: boolean;
  className?: string;
  /** seções que já têm um h2 próprio não precisam do rótulo na tela */
  rotuloOculto?: boolean;
};

/**
 * Moldura comum dos atos.
 *
 * A marcação "01 / Abertura" existe pra sustentar a leitura de roteiro:
 * o usuário percebe que está atravessando cenas numeradas, não rolando
 * uma lista de seções.
 */
export function Ato({
  id,
  numero,
  rotulo,
  children,
  claro = false,
  className,
  rotuloOculto = false,
}: Props) {
  return (
    <section
      id={id}
      className={[s.raiz, claro ? s.claro : '', className].filter(Boolean).join(' ')}
      data-tom={claro ? 'claro' : 'escuro'}
      aria-labelledby={`${id}-rotulo`}
    >
      <div className="container">
        <Reveal className={rotuloOculto ? s.marcacaoOculta : s.marcacao} distancia={28}>
          <span className={s.numero}>{numero}</span>
          <span className={s.traco} aria-hidden="true" />
          <span className={s.nome} id={`${id}-rotulo`}>
            {rotulo}
          </span>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
