'use client';

import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { Botao } from '@/components/ui/Botao';
import { Placeholder } from '@/components/ui/Placeholder';
import { BadgeFallback } from '@/components/three/BadgeFallback';
import { useCracha3d } from '@/components/three/Cracha';
import { useDeviceTier } from '@/lib/use-device-tier';
import { CENAS, definirAlvo } from '@/lib/cena-signal';
import s from './Ato9Convite.module.css';

/**
 * ATO 9 — CONVITE
 *
 * Clímax. O crachá volta ao centro, maior que na abertura, e a página fica
 * com um único caminho a seguir. Nada de segundo CTA competindo aqui.
 *
 * A microcopy abaixo do botão reduz risco sem prometer nada: onde caberia
 * um prazo de resposta, existe um placeholder — porque prazo prometido e
 * não cumprido é o primeiro tijolo da desconfiança que o Ato 2 descreveu.
 */
export function Ato9Convite() {
  const ref = useRef<HTMLElement>(null);
  const tem3d = useCracha3d();
  const tier = useDeviceTier();
  const alvoCena = tier.mobile ? CENAS.conviteMobile : CENAS.convite;

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 62%',
        // 'bottom bottom' encerrava o gatilho assim que o rodapé encostava na
        // base da tela — e o crachá sumia justamente no clímax. Enquanto
        // qualquer parte do ato estiver visível, ele mantém a cena.
        end: 'bottom top',
        onToggle: (self) => {
          if (self.isActive) definirAlvo(alvoCena);
        },
        onLeave: () => definirAlvo(CENAS.oculto),
        onLeaveBack: () => definirAlvo(CENAS.oculto),
      });

      return () => st.kill();
    },
    { scope: ref, dependencies: [alvoCena] },
  );

  return (
    <section className={s.raiz} id="ato-convite" ref={ref} aria-labelledby="ato-convite-rotulo">
      <div className={s.brilho} aria-hidden="true" />

      <div className={`container ${s.interno}`}>
        <div className={s.marcacao}>
          <span className={s.numero}>09</span>
          <span className={s.traco} aria-hidden="true" />
          <span className={s.nome} id="ato-convite-rotulo">
            Convite
          </span>
        </div>

        {!tem3d && (
          <div className={s.substituto}>
            <BadgeFallback />
          </div>
        )}

        <SplitWords
          texto="Conta o problema. A Atlas diz se resolve."
          como="h2"
          className={s.titulo}
        />

        <Reveal className={s.acao} duracao={0.82}>
          <div>
            <Botao href="#contato" aria="Falar com a Atlas">
              Falar com a Atlas
            </Botao>
            <p className={s.micro}>
              Sem compromisso e sem reunião obrigatória pra receber uma resposta.
            </p>
            <Placeholder>
              [CONTATO · definir o canal real (WhatsApp, e-mail ou formulário) e o prazo de
              resposta que a Atlas consegue cumprir sempre]
            </Placeholder>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
