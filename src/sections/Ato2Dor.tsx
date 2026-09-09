'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { DIST, DUR, EASE, STAGGER } from '@/lib/motion-tokens';
import s from './Ato2Dor.module.css';

/**
 * ATO 2 — A DOR
 *
 * A câmera recua. Fundo escuro, nenhuma imagem, nenhum ícone: só tipografia.
 * Depois da abertura cheia de movimento, a quietude aqui é o contraste que
 * faz o texto pesar.
 */

const SINTOMAS = [
  'O freelancer sumiu depois do último Pix.',
  'A agência entregou um tema comprado e chamou de projeto sob medida.',
  'Trocar um parágrafo virou orçamento novo.',
  'A mesma planilha continua sendo preenchida na mão, todo dia, pela mesma pessoa.',
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
          <SplitWords
            texto="O site ficou pronto. Ninguém consegue mexer nele."
            como="h2"
            className={s.titulo}
          />

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
                Nenhum desses problemas é técnico. Todos são de <em>depois</em> — de quem
                fica quando o projeto entra no ar e a operação começa a usar de verdade.
              </p>
            </Reveal>
          </div>
        </div>
      </Ato>
    </div>
  );
}
