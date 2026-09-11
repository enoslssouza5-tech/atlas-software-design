'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { useDeviceTier } from '@/lib/use-device-tier';
import { DIST, DUR, EASE, STAGGER } from '@/lib/motion-tokens';
import s from './Ato3Solucao.module.css';

/**
 * ATO 3: REVELAÇÃO DA SOLUÇÃO
 *
 * Único trecho pinado da página, só no desktop. A seção mede 300vh, o
 * palco fica preso em 100vh e o scrub 1.2 dá o arrasto de câmera: o
 * usuário empurra a cena, e ela responde com um leve atraso, como um
 * travelling pesado.
 *
 * No mobile o pin não entra: `100svh`/`300vh` misturados com a barra de
 * endereço do navegador aparecendo e sumindo desalinhava o cálculo do
 * ScrollTrigger, e os cards ficavam presos no `opacity:0` inicial pra
 * sempre. A seção mobile vira uma lista comum com fade-in simples, mesmo
 * padrão de `Ato5Projetos.tsx` pro carrossel.
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
  const palco = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();

  useGSAP(
    () => {
      const raiz = ref.current;
      const alvo = palco.current;
      // Sem esperar `tier.pronto`, o primeiro efeito roda com `tier.mobile`
      // no valor inicial (false, ver use-device-tier.ts) e monta o pin+scrub
      // de desktop por um instante, antes do efeito rodar de novo já certo
      // pro mobile. O primeiro card da lista (o único cujo `fromTo` aplica
      // estado inicial na hora, por `immediateRender`) ficava preso a meio
      // caminho da animação depois da troca. Mesma proteção que
      // `Ato5Projetos.tsx` já usa.
      if (!raiz || !alvo || !tier.pronto) return;

      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cartoes = gsap.utils.toArray<HTMLElement>(`.${s.cartao}`);

      // Menos movimento: nada de pin, nada de scrub. A seção vira uma lista
      // comum e continua legível do começo ao fim.
      if (reduzido) {
        gsap.set(cartoes, { opacity: 1, y: 0 });
        return;
      }

      // No mobile o pin não entra (ver comentário no topo do arquivo): fica
      // uma entrada simples em stagger, disparada uma vez, sem prender
      // scroll nem depender da altura da viewport mudando.
      if (tier.mobile) {
        gsap.fromTo(
          cartoes,
          { opacity: 0, y: DIST.medio },
          {
            opacity: 1,
            y: 0,
            duration: DUR.media,
            ease: EASE.entrada,
            stagger: STAGGER.padrao,
            scrollTrigger: { trigger: `.${s.blocos}`, start: 'top 80%', once: true },
          },
        );
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: raiz,
          start: 'top top',
          end: '+=200%',
          pin: alvo,
          // A seção já mede 300vh no CSS: 100vh de palco + 200vh de curso.
          // Deixar o pinSpacing reservar espaço de novo dobrava a altura e
          // abria um vazio depois do ato.
          pinSpacing: false,
          // Pinado e acima do Ato 5: recalcula antes dele, que por sua vez
          // recalcula antes de todo o resto.
          refreshPriority: 2,
          scrub: 1.2,
        },
      });

      cartoes.forEach((cartao, i) => {
        tl.fromTo(
          cartao,
          { opacity: 0, y: DIST.longo },
          { opacity: 1, y: 0, duration: DUR.longa, ease: EASE.entrada },
          // 0.2s de diferença entre blocos, na régua do scrub
          i * 0.2,
        );
      });

      // Sem cleanup manual de propósito. O useGSAP já reverte o que foi criado
      // dentro do escopo, e reverter é o ponto: ScrollTrigger.kill() sem
      // revert deixa o espaçador do pin no DOM. Em dev, com o StrictMode
      // montando duas vezes, cada remontagem empilhava mais um espaçador, e a
      // página crescia sozinha e todos os gatilhos abaixo saíam do lugar.
    },
    { scope: ref, dependencies: [tier.pronto, tier.mobile] },
  );

  return (
    <section className={s.raiz} id="ato-solucao" ref={ref} aria-labelledby="ato-solucao-rotulo">
      <div className={s.palco} ref={palco}>
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

          <Reveal className={s.mecanismo} distancia={DIST.curto} duracao={DUR.longa}>
            <p>
              A mesma equipe constrói, cuida do anúncio e dá suporte depois. Nada se perde
              entre fornecedores.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
