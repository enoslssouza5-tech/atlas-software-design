'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { SplitWords } from '@/components/ui/SplitWords';
import { MockupDuplo } from '@/components/ui/MockupDuplo';
import { Placeholder } from '@/components/ui/Placeholder';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useDeviceTier } from '@/lib/use-device-tier';
import { DUR, EASE } from '@/lib/motion-tokens';
import s from './Ato5Projetos.module.css';

/**
 * ATO 5: PROJETOS
 *
 * Carrossel horizontal. No desktop o eixo vertical do scroll vira eixo
 * horizontal via ScrollTrigger, com snap por cartão. No mobile e em reduced
 * motion vira scroll horizontal nativo com scroll-snap, mais previsível no
 * dedo e sem sequestrar o gesto do usuário.
 *
 * TODOS os sete projetos são fictícios, de demonstração. Nenhum é apresentado
 * como cliente real, e nenhum vira case sem confirmação e consentimento.
 */

const PROJETOS = [
  {
    n: '01',
    nicho: 'Imobiliário',
    titulo: 'Portal de imóveis com busca por bairro',
    escopo: 'Site + painel de anúncios',
    matiz: 205,
  },
  {
    n: '02',
    nicho: 'Advocacia',
    titulo: 'Site institucional com áreas de atuação',
    escopo: 'Site + captação de contato',
    matiz: 38,
  },
  {
    n: '03',
    nicho: 'Restaurante',
    titulo: 'Cardápio digital e reserva de mesa',
    escopo: 'Site + cardápio editável',
    matiz: 12,
  },
  {
    n: '04',
    nicho: 'E-commerce',
    titulo: 'Loja com estoque integrado ao ERP',
    escopo: 'Loja + integração',
    matiz: 268,
  },
  {
    n: '05',
    nicho: 'Saúde',
    titulo: 'Agendamento de consulta com confirmação automática',
    escopo: 'Sistema + automação',
    matiz: 168,
  },
  {
    n: '06',
    nicho: 'Educação',
    titulo: 'Área do aluno com trilha de conteúdo',
    escopo: 'Sistema + área logada',
    matiz: 224,
  },
  {
    n: '07',
    nicho: 'Serviços',
    titulo: 'Orçamento online com envio de proposta',
    escopo: 'Site + automação de proposta',
    matiz: 88,
  },
];

export function Ato5Projetos() {
  const ref = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const horizontalPorScroll = tier.pronto && !tier.mobile && !tier.reduzido;

  useGSAP(
    () => {
      const raiz = ref.current;
      const faixa = trilho.current;
      if (!raiz || !faixa || !horizontalPorScroll) return;

      const percurso = () => faixa.scrollWidth - window.innerWidth;

      const tween = gsap.to(faixa, {
        x: () => -percurso(),
        ease: 'none',
        scrollTrigger: {
          trigger: raiz,
          start: 'top top',
          end: () => '+=' + percurso(),
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          // O ScrollTrigger recalcula na ordem de CRIAÇÃO, não na ordem da
          // página. Este pin nasce depois de todos os atos abaixo dele (o
          // device tier resolve async), então sem prioridade explícita os
          // atos 6 a 9 se mediriam antes do espaçador existir, e ficariam
          // 1792px adiantados. Prioridade maior, recalculado primeiro.
          refreshPriority: 1,
          snap: { snapTo: 1 / (PROJETOS.length - 1), duration: 0.42, ease: EASE.entrada },
        },
      });

      // O pin nasce depois do device tier resolver, ou seja, DEPOIS dos
      // gatilhos dos atos 6 a 9 terem sido criados. O espaçador que ele
      // insere empurra tudo 1792px pra baixo, e quem está abaixo fica com
      // start/end de um documento que não existe mais.
      //
      // O refresh sai da pilha atual de propósito: chamado aqui dentro, ele
      // cai no guard de reentrância do ScrollTrigger (a criação do pin já
      // está no meio de um refresh) e é descartado em silêncio.
      const refresco = requestAnimationFrame(() => ScrollTrigger.refresh());

      // Profundidade: os mockups deslizam um pouco mais devagar que o cartão,
      // então o conjunto ganha eixo Z sem nenhuma perspectiva 3D real.
      gsap.utils.toArray<HTMLElement>('.' + s.mockup).forEach((m) => {
        gsap.fromTo(
          m,
          { xPercent: 7 },
          {
            xPercent: -7,
            ease: 'none',
            scrollTrigger: {
              trigger: m,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });

      return () => cancelAnimationFrame(refresco);
    },
    { scope: ref, dependencies: [horizontalPorScroll] },
  );

  useGSAP(
    () => {
      gsap.fromTo(
        '.' + s.cabecalho,
        { opacity: 0, y: 42 },
        {
          opacity: 1,
          y: 0,
          duration: DUR.media,
          ease: EASE.entrada,
          scrollTrigger: { trigger: '.' + s.cabecalho, start: 'top 82%', once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      className={s.raiz}
      id="ato-projetos"
      ref={ref}
      data-modo={horizontalPorScroll ? 'pin' : 'nativo'}
      aria-labelledby="ato-projetos-rotulo"
    >
      <div className={s.palco}>
        <div className={`container ${s.cabecalho}`}>
          <div className={s.marcacao}>
            <span className={s.numero}>05</span>
            <span className={s.traco} aria-hidden="true" />
            <span className={s.nome} id="ato-projetos-rotulo">
              Projetos
            </span>
          </div>
          <Eyebrow>Nossos projetos</Eyebrow>
          <SplitWords
            texto="Sete demonstrações, sete setores."
            como="h2"
            className={s.titulo}
          />
          <Placeholder bloco>
            [PROJETOS · os sete abaixo são mockups fictícios de demonstração. Substituir
            por trabalhos reais da Atlas, com autorização de cada cliente]
          </Placeholder>
        </div>

        <div className={s.trilho} ref={trilho}>
          {PROJETOS.map((p) => (
            <article key={p.n} className={s.cartao}>
              <div className={s.mockup}>
                <MockupDuplo matiz={p.matiz} titulo={p.titulo} />
              </div>
              <div className={s.info}>
                <span className={s.nicho}>
                  <span className={s.indice}>{p.n}</span>
                  {p.nicho}
                </span>
                <h3 className={s.cartaoTitulo}>{p.titulo}</h3>
                <p className={s.escopo}>{p.escopo}</p>
                <span className={s.ficticio}>Mockup fictício de demonstração</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
