'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { SplitWords } from '@/components/ui/SplitWords';
import { useDeviceTier } from '@/lib/use-device-tier';
import { DIST, DUR, EASE, STAGGER } from '@/lib/motion-tokens';
import s from './Ato3Solucao.module.css';

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
    nome: 'Websites',
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
    nome: 'Sistemas',
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
    nome: 'Automações',
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
    nome: 'Tráfego pago',
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
    nome: 'Manutenção',
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
    nome: 'Suporte',
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
  const [ativo, setAtivo] = useState(0);

  const ativar = (indiceAtivo: number) => {
    setAtivo(indiceAtivo);

    const raiz = ref.current;
    if (!raiz || typeof window === 'undefined') return;

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 1023px)').matches;
    const paineis = gsap.utils.toArray<HTMLElement>(raiz.querySelectorAll(`.${s.painel}`));

    if (reduzido || mobile) {
      gsap.set(paineis, { flexGrow: 1 });
      return;
    }

    gsap.to(paineis, {
      flexGrow: (indice) => (indice === indiceAtivo ? 3.4 : 0.86),
      duration: DUR.media,
      ease: EASE.entrada,
      overwrite: true,
    });
  };

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz || !tier.pronto) return;

      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const paineis = gsap.utils.toArray<HTMLElement>(`.${s.painel}`);

      if (reduzido) {
        gsap.set(paineis, { opacity: 1, y: 0 });
        return;
      }

      if (!tier.mobile) {
        gsap.set(paineis, { flexGrow: (indice) => (indice === ativo ? 3.4 : 0.86) });
      }

      gsap.fromTo(
        paineis,
        { opacity: 0, y: tier.mobile ? DIST.medio : DIST.longo },
        {
          opacity: 1,
          y: 0,
          duration: tier.mobile ? DUR.media : DUR.longa,
          ease: EASE.entrada,
          stagger: tier.mobile ? STAGGER.padrao : 0.2,
          scrollTrigger: { trigger: `.${s.composicao}`, start: 'top 80%', once: true },
        },
      );
    },
    { scope: ref, dependencies: [tier.pronto, tier.mobile, ativo] },
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

          <div className={s.composicao}>
            <div className={s.accordion} aria-label="Frentes de atuação da Atlas">
              {FRENTES.map((frente, indice) => {
                const aberto = ativo === indice;

                return (
                  <button
                    key={frente.n}
                    type="button"
                    className={`${s.painel} ${aberto ? s.ativo : ''}`}
                    aria-expanded={aberto}
                    onMouseEnter={() => ativar(indice)}
                    onFocus={() => ativar(indice)}
                    onClick={() => ativar(indice)}
                  >
                    <span className={s.topo}>
                      <span className={s.indice}>{frente.n}</span>
                      <span className={s.icone}>{frente.icone}</span>
                    </span>
                    <span className={s.nome}>{frente.nome}</span>
                    <span className={s.descricao}>{frente.texto}</span>
                  </button>
                );
              })}
            </div>

            <aside className={s.mecanismo}>
              <p>
                A mesma equipe constrói, cuida do anúncio e dá suporte depois.{' '}
                <strong>Nada se perde entre fornecedores.</strong>
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
