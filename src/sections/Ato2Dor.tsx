'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Ato } from '@/components/ui/Ato';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
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
  'O clique do anúncio não vira cliente contável.',
  'Cadastro feito num sistema não aparece no site, e alguém copia isso à mão.',
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
      <Ato id="ato-dor" rotulo="A dor">
        <div className={s.grade}>
          <div className={s.aberturaBloco}>
            <Eyebrow>Ninguém te falou isso antes de vender o projeto</Eyebrow>
            <Reveal como="h2" className={s.abertura} distancia={DIST.medio} duracao={DUR.longa}>
              O problema raramente é falta de site, sistema, automação ou anúncio. É essas
              peças não conversarem entre si, cada uma vinda de um fornecedor diferente. A
              Atlas monta as quatro com a mesma equipe, sem você virar o elo que junta tudo
              na mão.
            </Reveal>
          </div>

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
                Não é falta de esforço da sua equipe. É falta de alguém cuidando das
                quatro pontas juntas.
              </p>
            </Reveal>
          </div>
        </div>
      </Ato>
    </div>
  );
}
