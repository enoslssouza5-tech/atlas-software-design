'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useAbertura } from '@/providers/AberturaProvider';
import { useLenis } from '@/providers/LenisProvider';
import { SplitWords } from '@/components/ui/SplitWords';
import { Botao } from '@/components/ui/Botao';
import { DIST, DUR, EASE, SILENCIO } from '@/lib/motion-tokens';
import s from './Ato1Hero.module.css';

const HEADLINE = 'Tecnologia que transforma processos em crescimento.';

/**
 * ATO 1: ABERTURA
 *
 * A cena fica 0.4s em silêncio antes de qualquer coisa se mexer. Não é
 * atraso acidental: é o respiro que separa a chegada da apresentação, e é
 * o que faz a headline parecer um corte de câmera e não um carregamento.
 */
export function Ato1Hero() {
  const ref = useRef<HTMLElement>(null);
  const { liberado } = useAbertura();
  const { irPara } = useLenis();

  useGSAP(
    () => {
      if (!liberado) {
        // A lista aqui precisa bater exatamente com o que a timeline de
        // entrada anima lá embaixo. `.acoes` (o contêiner) nunca é alvo da
        // timeline, só `.acoes > *` (os botões); esconder o contêiner aqui
        // deixava um opacity:0 órfão que o revert do próximo run não
        // limpava, e os dois botões ficavam invisíveis pra sempre.
        gsap.set(`.${s.acoes} > *`, {
          opacity: 0,
        });
        return;
      }

      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const t = (v: number) => (reduzido ? 0 : v);

      const tl = gsap.timeline({ delay: t(SILENCIO.hero) });

      tl.fromTo(
        `.${s.veu}`,
        { opacity: 1 },
        { opacity: 0, duration: t(0.84) || 0.01, ease: EASE.entrada },
      )
        // a headline entra pelo SplitWords, cronometrada pelo mesmo silêncio
        .fromTo(
          `.${s.acoes} > *`,
          { opacity: 0, y: DIST.curto },
          { opacity: 1, y: 0, duration: DUR.media, ease: EASE.entrada, stagger: 0.1 },
          t(1.44),
        );
    },
    { scope: ref, dependencies: [liberado] },
  );

  return (
    <section className={s.raiz} id="ato-hero" ref={ref}>
      <div className={s.veu} aria-hidden="true" />

      <div className={`${s.faixa} ${s.grade}`}>
        <div className={s.texto}>
          <SplitWords
            texto={HEADLINE}
            como="h1"
            className={s.headline}
            gatilho={liberado ? 'imediato' : 'nenhum'}
            atraso={SILENCIO.hero + 0.42}
            destacarIndices={[3, 5]}
          />

          <div className={s.acoes}>
            <Botao className={s.botaoHero} onClick={() => irPara('#ato-convite')}>Falar com a Atlas</Botao>
            <Botao className={s.botaoHero} variante="fantasma" onClick={() => irPara('#ato-projetos')}>
              Ver projetos
            </Botao>
          </div>
        </div>
      </div>
    </section>
  );
}
