'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Ato } from '@/components/ui/Ato';
import { Reveal } from '@/components/ui/Reveal';
import { CardReveal } from '@/components/ui/CardReveal';
import { DIST, DUR, EASE, STAGGER } from '@/lib/motion-tokens';
import s from './Ato2Dor.module.css';

/**
 * ATO 2: A DOR
 *
 * A câmera recua. Fundo escuro, nenhuma imagem, nenhum ícone: só tipografia.
 * Depois da abertura cheia de movimento, a quietude aqui é o contraste que
 * faz o texto pesar.
 */

const SINTOMAS_ESQUERDA = [
  'O clique do anúncio não vira cliente contável.',
  'Cadastro feito num sistema não aparece no site, e alguém copia isso à mão.',
];

const SINTOMAS_DIREITA = [
  'Cada fornecedor empurra a culpa pro outro quando algo trava.',
  'Ajuste simples vira semana de espera.',
];

export function Ato2Dor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        `.${s.sintoma}`,
        { opacity: 0, y: DIST.curto },
        {
          opacity: 1,
          y: 0,
          duration: DUR.media,
          ease: EASE.entrada,
          stagger: STAGGER.solto,
          scrollTrigger: { trigger: `.${s.lista}`, start: 'top 76%', once: true },
        },
      );

      // Timeline vertical: cada bolinha acende (contorno vazio vira
      // preenchido em laranja) conforme entra na área visível durante o
      // scroll da seção. `ScrollTrigger.batch`, não um trigger só no topo
      // da lista, porque o pedido é acender item por item conforme cada um
      // cruza a viewport, não todos de uma vez quando a lista aparece.
      ScrollTrigger.batch(`.${s.marcador}`, {
        start: 'top 82%',
        once: true,
        onEnter: (marcadores) => {
          gsap.to(marcadores, {
            backgroundColor: '#F2790C',
            borderColor: '#F2790C',
            boxShadow: '0 0 0 4px rgba(242, 121, 12, 0.16)',
            duration: DUR.curta,
            ease: EASE.entrada,
            stagger: STAGGER.padrao,
          });
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <Ato id="ato-dor" rotulo="A dor">
        <div className={s.grade}>
          <Reveal como="h2" className={s.abertura} distancia={DIST.medio} duracao={DUR.longa}>
            O problema raramente é falta de site, sistema, automação ou anúncio. É essas
            peças não conversarem entre si. A Atlas monta as quatro com a mesma equipe.
          </Reveal>

          <div className={s.corpo}>
            <ul className={s.lista}>
              {SINTOMAS_ESQUERDA.map((linha) => (
                <li key={linha} className={s.sintoma}>
                  <span className={s.marcador} aria-hidden="true" />
                  {linha}
                </li>
              ))}
            </ul>

            <CardReveal className={s.remate} duracao={DUR.longa}>
              <p>
                Não é falta de esforço da sua equipe. É falta de alguém cuidando das
                quatro pontas juntas.
              </p>
            </CardReveal>

            <ul className={s.lista}>
              {SINTOMAS_DIREITA.map((linha) => (
                <li key={linha} className={s.sintoma}>
                  <span className={s.marcador} aria-hidden="true" />
                  {linha}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Ato>
    </div>
  );
}
