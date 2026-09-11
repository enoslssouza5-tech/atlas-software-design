'use client';

import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
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
          <Eyebrow>Pode mexer</Eyebrow>
          <SplitWords
            texto="As ferramentas que a Atlas usa. Pode mexer."
            como="h2"
            className={s.titulo}
          />

          <Reveal className={s.corpo} duracao={0.82}>
            <p>
              Nenhuma ferramenta está aqui por moda. Cada uma resolve um problema real, e
              quem escreveu o código continua mantendo. Arraste uma bolinha e solte.{' '}
              <strong className={s.destaque}>Pode mexer.</strong>
            </p>
          </Reveal>
        </div>

        <div className={s.pote}>
          <PoteStack />
        </div>
      </div>
    </Ato>
  );
}
