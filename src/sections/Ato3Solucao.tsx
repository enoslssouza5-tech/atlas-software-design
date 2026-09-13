'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { SplitWords } from '@/components/ui/SplitWords';
import { CardReveal } from '@/components/ui/CardReveal';
import { useDeviceTier } from '@/lib/use-device-tier';
import { DIST, DUR, EASE, STAGGER } from '@/lib/motion-tokens';
import s from './Ato3Solucao.module.css';

/**
 * ATO 3: REVELAÇÃO DA SOLUÇÃO
 *
 * A entrada dos seis cards é um fade e leve subida disparado uma única vez
 * quando a seção entra na tela, com stagger entre eles. Não é mais um pin
 * com scrub: amarrar a opacidade de cada card ao progresso contínuo do
 * scroll fazia o efeito parecer errático, e a opacidade ficava inconsistente
 * pra quem subia e descia a página depois de já ter visto a seção. Uma vez
 * revelados, os cards ficam visíveis, sem recalcular nada.
 *
 * Mesmo mecanismo em desktop e mobile agora (o mobile já usava fade-in
 * simples, sem pin, desde que o pin+scrub de 300vh/100svh desalinhava com a
 * barra de endereço do navegador aparecendo e sumindo).
 */

const tracoComum = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.15,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const FRENTES = [
  {
    n: '01',
    texto: 'Websites institucionais, landing pages e catálogos.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="7" width="24" height="18" rx="2" {...tracoComum} />
        <path d="M4 12h24" {...tracoComum} />
      </svg>
    ),
  },
  {
    n: '02',
    texto: 'Sistemas sob medida, painel interno e cadastro pro seu processo.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="5" width="9.5" height="9.5" rx="1.5" {...tracoComum} />
        <rect x="17.5" y="5" width="9.5" height="9.5" rx="1.5" {...tracoComum} />
        <rect x="5" y="17.5" width="9.5" height="9.5" rx="1.5" {...tracoComum} />
        <rect x="17.5" y="17.5" width="9.5" height="9.5" rx="1.5" {...tracoComum} />
      </svg>
    ),
  },
  {
    n: '03',
    texto: 'Automações, tarefa manual vira rotina entre sistema, WhatsApp e planilha.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M23 11H12a5 5 0 0 0-5 5v1" {...tracoComum} />
        <path d="M20 8l3 3-3 3" {...tracoComum} />
        <path d="M9 21h11a5 5 0 0 0 5-5v-1" {...tracoComum} />
        <path d="M12 24l-3-3 3-3" {...tracoComum} />
      </svg>
    ),
  },
  {
    n: '04',
    texto: 'Tráfego pago, Google e Meta Ads com captação real de cliente.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 13v6h4l9 5V8l-9 5H5z" {...tracoComum} />
        <path d="M22 13a4.2 4.2 0 0 1 0 6" {...tracoComum} />
      </svg>
    ),
  },
  {
    n: '05',
    texto: 'Manutenção contínua, sempre por perto depois do site no ar.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M19.5 9a5 5 0 0 1-6.33 4.82L7.4 19.6a2.1 2.1 0 1 1-3-3l5.78-5.77A5 5 0 1 1 19.5 9z"
          {...tracoComum}
        />
      </svg>
    ),
  },
  {
    n: '06',
    texto: 'Suporte direto com quem constrói e com quem cuida do anúncio.',
    icone: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 8h22v14H14l-6 5v-5H5z" {...tracoComum} />
        <path d="M11 14h10M11 18h6" {...tracoComum} />
      </svg>
    ),
  },
];

export function Ato3Solucao() {
  const ref = useRef<HTMLElement>(null);
  const tier = useDeviceTier();

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz || !tier.pronto) return;

      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cartoes = gsap.utils.toArray<HTMLElement>(`.${s.cartao}`);

      // Menos movimento: sem stagger, sem subida. A seção continua legível
      // do começo ao fim.
      if (reduzido) {
        gsap.set(cartoes, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        cartoes,
        { opacity: 0, y: tier.mobile ? DIST.medio : DIST.longo },
        {
          opacity: 1,
          y: 0,
          duration: tier.mobile ? DUR.media : DUR.longa,
          ease: EASE.entrada,
          // 0.2s de diferença entre blocos, disparado uma vez ao entrar.
          stagger: tier.mobile ? STAGGER.padrao : 0.2,
          scrollTrigger: { trigger: `.${s.blocos}`, start: 'top 80%', once: true },
        },
      );
    },
    { scope: ref, dependencies: [tier.pronto, tier.mobile] },
  );

  return (
    <section className={s.raiz} id="ato-solucao" ref={ref} aria-labelledby="ato-solucao-rotulo">
      <div className={s.palco}>
        <div className={`container ${s.interno}`}>
          <header className={s.cabecalho}>
            <span className="sr-only" id="ato-solucao-rotulo">
              A solução
            </span>
            <SplitWords texto="Seis frentes, uma equipe só." como="h2" className={s.titulo} />
          </header>

          <div className={s.blocos}>
            {FRENTES.map((frente) => (
              <article key={frente.n} className={s.cartao}>
                <span className={s.icone}>{frente.icone}</span>
                <span className={s.indice}>{frente.n}</span>
                <p className={s.cartaoTexto}>{frente.texto}</p>
              </article>
            ))}
          </div>

          <CardReveal className={s.mecanismo} duracao={DUR.longa}>
            <p>
              A mesma equipe constrói, cuida do anúncio e dá suporte depois. Nada se
              perde entre fornecedores.
            </p>
          </CardReveal>
        </div>
      </div>
    </section>
  );
}
