'use client';

import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { PoteStack } from '@/components/canvas2d/PoteStack';
import s from './Ato7Stack.module.css';

/**
 * ATO 7: STACK
 *
 * Depois de sete atos de scroll dirigido, a página devolve o controle:
 * aqui o usuário pega, arrasta e joga as bolinhas. É a única interação
 * livre da jornada, e vem de propósito logo antes da oferta.
 *
 * O pote roda em Canvas 2D puro, isolado de tudo, sem GSAP, sem three,
 * sem lib de física.
 */
export function Ato7Stack() {
  return (
    <Ato id="ato-stack" rotulo="Ferramentas">
      <div className={s.grade}>
        <div className={s.texto}>
          <SplitWords
            texto="As ferramentas que movem a Atlas."
            como="h2"
            className={s.titulo}
          />

          <Reveal className={s.corpo} duracao={0.82}>
            <p>
              Nenhuma está aqui por tendência. Cada uma existe porque resolve um problema
              real do seu negócio. E quem constrói também acompanha, ajusta e mantém.
            </p>
            <p className={s.interacao}>Arraste uma bolinha. Experimente.</p>
          </Reveal>
        </div>

        <div className={s.pote}>
          <PoteStack />
        </div>
      </div>
    </Ato>
  );
}
