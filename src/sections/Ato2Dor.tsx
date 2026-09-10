'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Ato } from '@/components/ui/Ato';
import { Reveal } from '@/components/ui/Reveal';
import { DIST, DUR, EASE, STAGGER } from '@/lib/motion-tokens';
import s from './Ato2Dor.module.css';

/**
 * ATO 2: A DOR
 *
 * A câmera recua. Fundo escuro, nenhuma imagem, nenhum ícone: só tipografia.
 * Depois da abertura cheia de movimento, a quietude aqui é o contraste que
 * faz o texto pesar.
 */

const SINTOMAS = [
  'O anúncio traz clique, mas ninguém sabe dizer quantos desses cliques viraram cliente de verdade.',
  'O sistema roda separado do site, então um cadastro feito num lugar não aparece no outro, e alguém da sua equipe copia isso à mão todo dia.',
  'Cada fornecedor, quem fez o site, quem cuida do anúncio, quem mantém o sistema, empurra a culpa pro outro quando algo trava.',
  'Pedido de ajuste simples vira semana de espera porque o fornecedor atual está sobrecarregado com outros clientes.',
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

      gsap.fromTo(
        `.${s.filete}`,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: DUR.longa,
          ease: EASE.entrada,
          scrollTrigger: { trigger: `.${s.lista}`, start: 'top 76%', once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <Ato id="ato-dor" numero="02" rotulo="A dor">
        <div className={s.grade}>
          <Reveal como="h2" className={s.abertura} distancia={DIST.medio} duracao={DUR.longa}>
            Quatro áreas resolvem presença digital de verdade, site, sistema, automação e
            anúncio pago. O problema raramente é falta de uma dessas peças. É elas não
            conversarem entre si porque cada uma veio de um fornecedor diferente, sem
            ninguém garantindo que o lead do anúncio chega organizado no sistema, ou que o
            site aguenta o tráfego que o anúncio traz. A Atlas monta essas quatro peças com
            a mesma equipe, do escopo à manutenção. Você não precisa ser o elo que junta
            tudo isso na mão.
          </Reveal>

          <div className={s.coluna}>
            <ul className={s.lista}>
              {SINTOMAS.map((linha) => (
                <li key={linha} className={s.sintoma}>
                  <span className={s.filete} aria-hidden="true" />
                  {linha}
                </li>
              ))}
            </ul>

            <Reveal className={s.remate} distancia={DIST.curto} duracao={DUR.longa}>
              <p>
                Nenhum desses problemas é falta de esforço da sua equipe. É falta de
                alguém cuidando das quatro pontas juntas.
              </p>
            </Reveal>
          </div>
        </div>
      </Ato>
    </div>
  );
}
