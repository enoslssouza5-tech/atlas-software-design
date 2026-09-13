'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useAbertura } from '@/providers/AberturaProvider';
import { useLenis } from '@/providers/LenisProvider';
import { SplitWords } from '@/components/ui/SplitWords';
import { Botao } from '@/components/ui/Botao';
import { BadgeFallback } from '@/components/three/BadgeFallback';
import { useCracha3d } from '@/components/three/Cracha';
import { useDeviceTier } from '@/lib/use-device-tier';
import { CENAS, definirAlvo, pontoDeTelaParaCena, sinal } from '@/lib/cena-signal';
import { criarFiltroResizeReal } from '@/lib/resize-real';
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
  const espacoRef = useRef<HTMLDivElement>(null);
  const { liberado } = useAbertura();
  const { irPara } = useLenis();
  const tem3d = useCracha3d();
  const tier = useDeviceTier();

  // No mobile, o alvo x/y real vem da posição do próprio `.espacoCracha` na
  // tela, não de um número cravado no código: medido uma vez no mount e de
  // novo se a janela redimensionar (rotação de tela, por exemplo), nunca a
  // cada frame de scroll, pra não reintroduzir o crachá "andando" enquanto
  // gira. Guardado numa ref mutável, não em `useState`: o valor só importa
  // no instante em que o ScrollTrigger abaixo lê pra chamar `definirAlvo`,
  // então remedir nunca precisa provocar um re-render nem recriar nada.
  // Antes da primeira medição, cai no valor de `CENAS.heroMobile`.
  const alvoMobileRef = useRef({ x: CENAS.heroMobile.x, y: CENAS.heroMobile.y });

  useLayoutEffect(() => {
    if (!tier.mobile) return;
    const medir = () => {
      const el = espacoRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      alvoMobileRef.current = pontoDeTelaParaCena(r.left + r.width / 2, r.top + r.height / 2);
    };
    medir();

    // No mobile, a barra de endereço do navegador recolhendo durante o
    // scroll dispara `resize` mudando só a altura da janela, não a
    // largura. Sem filtrar isso, cada recolhimento remedia o retângulo do
    // `.espacoCracha` (que também mudou de tamanho na tela, porque o
    // layout inteiro respira com a nova altura) e o alvo saltava pra um
    // valor bem diferente no meio do scroll.
    const resizeReal = criarFiltroResizeReal(tier.mobile);
    const aoRedimensionar = () => {
      if (resizeReal()) medir();
    };
    window.addEventListener('resize', aoRedimensionar);
    return () => window.removeEventListener('resize', aoRedimensionar);
  }, [tier.mobile, tem3d]);

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;

      // Trava a máscara física do crachá (ver BadgeCanvas.module.css) no
      // fim real da seção, independente de qualquer ScrollTrigger: o Canvas
      // nunca desenha abaixo daqui, mesmo se `sinal`/opacidade errarem o
      // timing no futuro.
      const aplicarMascara = () => {
        document.documentElement.style.setProperty(
          '--hero-fim',
          `${raiz.getBoundingClientRect().bottom}px`,
        );
      };
      aplicarMascara();

      // O crachá é reivindicado por este ato enquanto ele estiver na tela.
      // Posição fixa em x/y desde a entrada: nenhum tween nem ScrollTrigger
      // muda a posição do objeto depois disso, só a rotação (`stGiro`
      // abaixo). `onToggle` lê `alvoMobileRef.current` na hora, não um
      // valor fechado na criação do efeito: assim, remedir essa ref (mesmo
      // que aconteça por engano em algum resize real) nunca precisa
      // recriar este ScrollTrigger, porque a ref não é dependência de
      // nada, só é lida quando o crachá está de fato entrando na seção.
      // `end` em 'bottom top': a base do Hero precisa encostar no topo da
      // tela (a seção sair inteira de vista) pra `onLeave` disparar. Isso é
      // MAIS TARDE que 'bottom 55%', não mais cedo: a borda de baixo do
      // Hero cruza a marca de 55% da tela antes de cruzar o topo (0%),
      // conforme a página rola. O crachá fica visível por mais tempo com
      // esta troca, não menos.
      //
      // `onUpdate` também atualiza `--hero-fim` (a máscara do crachá, ver
      // BadgeCanvas.module.css) a cada frame de scroll enquanto este
      // ScrollTrigger está ativo: reaproveita o range mais longo (até
      // 'bottom top') pra a máscara acompanhar a seção até ela sair de
      // vista de verdade, em vez de criar um terceiro observador.
      const st = ScrollTrigger.create({
        trigger: raiz,
        start: 'top 60%',
        end: 'bottom top',
        onUpdate: () => aplicarMascara(),
        onToggle: (self) => {
          if (!self.isActive) return;
          const alvo = tier.mobile
            ? { ...CENAS.heroMobile, x: alvoMobileRef.current.x, y: alvoMobileRef.current.y }
            : CENAS.hero;
          definirAlvo(alvo);
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
          document.documentElement.style.removeProperty('--hero-fim');
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
        document.documentElement.style.removeProperty('--hero-fim');
      };
    },
    { scope: ref, dependencies: [liberado, tier.mobile, tem3d] },
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
              (ver CSS), fica abaixo dos botões, e é a partir DESTE
              retângulo que o alvo x/y do crachá é medido (ver
              `useLayoutEffect` acima), pro crachá nunca sobrepor o texto.
              Sem WebGL o substituto estático já cai no lugar certo sozinho,
              por ordem normal do DOM. */}
          {tem3d && <div ref={espacoRef} className={s.espacoCracha} aria-hidden="true" />}
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
