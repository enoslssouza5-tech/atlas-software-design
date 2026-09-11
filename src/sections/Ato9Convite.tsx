'use client';

import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { Botao } from '@/components/ui/Botao';
import s from './Ato9Convite.module.css';

/**
 * ATO 9: CONVITE
 *
 * Clímax reduzido ao essencial, só a headline que ecoa a abertura e um
 * único caminho a seguir. Nada de segundo CTA, nem texto de apoio
 * competindo aqui.
 *
 * O crachá não reaparece: ele vive só no Ato 1, estático, e o giro dele já
 * aconteceu lá.
 */
export function Ato9Convite() {
  return (
    <section className={s.raiz} id="ato-convite" aria-labelledby="ato-convite-rotulo">
      <div className={s.brilho} aria-hidden="true" />

      <div className={`container ${s.interno}`}>
        <span className="sr-only" id="ato-convite-rotulo">
          Convite
        </span>

        <SplitWords
          texto="Você não perde cliente por falta de anúncio. Perde quando ele cai entre fornecedores que não se falam."
          como="h2"
          className={s.titulo}
        />

        <Reveal className={s.acao} duracao={0.82}>
          <Botao href="#contato" aria="Falar com a Atlas">
            Falar com a Atlas
          </Botao>
        </Reveal>
      </div>
    </section>
  );
}
