'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useAbertura } from '@/providers/AberturaProvider';
import { useLenis } from '@/providers/LenisProvider';
import { SplitWords } from '@/components/ui/SplitWords';
import { Botao } from '@/components/ui/Botao';
import { BadgeFallback } from '@/components/three/BadgeFallback';
import { useCracha3d } from '@/components/three/Cracha';
import { useDeviceTier } from '@/lib/use-device-tier';
import { CENAS, definirAlvo, pontoDeTelaParaCena, sinal } from '@/lib/cena-signal';
import { DIST, DUR, EASE, SILENCIO } from '@/lib/motion-tokens';
import s from './Ato1Hero.module.css';

const HEADLINE =
  'Você não perde cliente por falta de anúncio. Perde quando ele cai entre fornecedores que não se falam.';

/**
 * ATO 1: ABERTURA
 *
 * A cena fica 0.4s em silêncio antes de qualquer coisa se mexer. Não é
 * atraso acidental: é o respiro que separa a chegada da apresentação, e é
 * o que faz a headline parecer um corte de câmera e não um carregamento.
 */
export function Ato1Hero() {
  const ref = useRef<HTMLElement>(null);
  const espacoCracha = useRef<HTMLDivElement>(null);
  const { liberado } = useAbertura();
  const { irPara } = useLenis();
  const tem3d = useCracha3d();
  const tier = useDeviceTier();
  const alvoCena = tier.mobile ? CENAS.heroMobile : CENAS.hero;

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;

      // O crachá é reivindicado por este ato enquanto ele estiver na tela.
      // No mobile não existe um x/y fixo: a posição é recalculada a partir
      // do retângulo do espaço reservado abaixo dos botões (`espacoCracha`),
      // pra o crachá 3D (Canvas fixo, fora do fluxo normal) grudar
      // visualmente nesse lugar em vez de sobrepor o texto.
      // `end` em 'bottom 55%' bate exatamente com o fim do giro (`stGiro`
      // abaixo): o crachá começa a sumir por opacidade no mesmo ponto de
      // scroll em que a meia volta termina, não 200px de scroll depois.
      // Antes os dois `end` eram diferentes ('bottom 22%' aqui) e sobrava
      // uma janela de scroll inteira com o crachá girado, parado, em
      // opacidade máxima, sem nada cobrindo, flutuando por cima do Ato 2
      // (que agora é transparente pro fundo de partículas aparecer atrás
      // dele). O fade em si continua suave: `estado.opacidade` no
      // `BadgeScene` interpola por frame até o alvo, então virar o alvo
      // pra `CENAS.oculto` aqui não é um corte seco, é o início de uma
      // transição de menos de um segundo.
      const elEspaco = espacoCracha.current;
      const st =
        tier.mobile && elEspaco
          ? ScrollTrigger.create({
              trigger: raiz,
              start: 'top 60%',
              end: 'bottom 55%',
              scrub: true,
              onUpdate: (self) => {
                if (!self.isActive) return;
                const r = elEspaco.getBoundingClientRect();
                const { x, y } = pontoDeTelaParaCena(
                  r.left + r.width / 2,
                  r.top + r.height / 2,
                );
                definirAlvo({
                  x,
                  y,
                  escala: CENAS.heroMobile.escala,
                  opacidade: CENAS.heroMobile.opacidade,
                });
              },
              onLeave: () => definirAlvo(CENAS.oculto),
              onLeaveBack: () => definirAlvo(CENAS.oculto),
            })
          : ScrollTrigger.create({
              trigger: raiz,
              start: 'top 60%',
              end: 'bottom 55%',
              onToggle: (self) => {
                if (self.isActive) definirAlvo(alvoCena);
              },
              onLeave: () => definirAlvo(CENAS.oculto),
              onLeaveBack: () => definirAlvo(CENAS.oculto),
            });

      // Meia volta do crachá, presa ao scroll só enquanto o Hero passa pela
      // tela. Scrub sem suavização por baixo garante progresso 1 para 1:
      // passado o `end`, o ScrollTrigger para de chamar onUpdate e o valor
      // trava onde parou, sem continuar nem voltar a girar depois.
      const stGiro = ScrollTrigger.create({
        trigger: raiz,
        start: 'top top',
        end: 'bottom 55%',
        scrub: true,
        onUpdate: (self) => {
          sinal.giroHero = self.progress * Math.PI;
        },
      });

      if (!liberado) {
        // A lista aqui precisa bater exatamente com o que a timeline de
        // entrada anima lá embaixo. `.acoes` (o contêiner) nunca é alvo da
        // timeline, só `.acoes > *` (os botões); esconder o contêiner aqui
        // deixava um opacity:0 órfão que o revert do próximo run não
        // limpava, e os dois botões ficavam invisíveis pra sempre.
        gsap.set([`.${s.sub}`, `.${s.acoes} > *`], {
          opacity: 0,
        });
        return () => {
          st.kill();
          stGiro.kill();
        };
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
          `.${s.sub}`,
          { opacity: 0, y: DIST.curto },
          { opacity: 1, y: 0, duration: DUR.media, ease: EASE.entrada },
          t(1.26),
        )
        .fromTo(
          `.${s.acoes} > *`,
          { opacity: 0, y: DIST.curto },
          { opacity: 1, y: 0, duration: DUR.media, ease: EASE.entrada, stagger: 0.1 },
          t(1.44),
        );

      return () => {
        st.kill();
        stGiro.kill();
      };
    },
    { scope: ref, dependencies: [liberado, alvoCena, tem3d] },
  );

  return (
    <section className={s.raiz} id="ato-hero" ref={ref}>
      <div className={s.veu} aria-hidden="true" />
      <div className={s.brilho} aria-hidden="true" />

      <div className={`container ${s.grade}`}>
        <div className={s.texto}>
          <SplitWords
            texto={HEADLINE}
            como="h1"
            className={s.headline}
            gatilho={liberado ? 'imediato' : 'nenhum'}
            atraso={SILENCIO.hero + 0.42}
          />

          <p className={s.sub}>
            Site, sistema, automação e tráfego pago, sob a mesma equipe. Combinado por
            escrito, código seu, suporte contínuo.
          </p>

          <div className={s.acoes}>
            <Botao onClick={() => irPara('#ato-convite')}>Falar com a Atlas</Botao>
            <Botao variante="fantasma" onClick={() => irPara('#ato-projetos')}>
              Ver projetos
            </Botao>
          </div>

          {/* Só reserva espaço quando existe cena 3D pra mirar: no mobile
              (ver CSS), o crachá (Canvas fixo, fora do fluxo normal) usa
              esse retângulo pra aparecer abaixo dos botões, nunca sobre o
              texto. Sem WebGL o substituto estático já cai no lugar certo
              sozinho, por ordem normal do DOM. */}
          {tem3d && <div ref={espacoCracha} className={s.espacoCracha} aria-hidden="true" />}
        </div>

        {/* Sem WebGL ou em conexão econômica, o crachá estático ocupa
            exatamente o mesmo lugar da cena 3D. A composição não muda. */}
        {!tem3d && (
          <div className={s.substituto}>
            <BadgeFallback />
          </div>
        )}
      </div>
    </section>
  );
}
