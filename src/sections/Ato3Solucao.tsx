'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Placeholder } from '@/components/ui/Placeholder';
import { DIST, DUR, EASE } from '@/lib/motion-tokens';
import s from './Ato3Solucao.module.css';

/**
 * ATO 3: REVELAÇÃO DA SOLUÇÃO
 *
 * Único trecho pinado da página. A seção mede 300vh, o palco fica preso em
 * 100vh e o scrub 1.2 dá o arrasto de câmera: o usuário empurra a cena, e ela
 * responde com um leve atraso, como um travelling pesado.
 *
 */

const FRENTES = [
  { n: '01', texto: 'Websites institucionais, landing pages e catálogos.' },
  { n: '02', texto: 'Sistemas sob medida, painel interno e cadastro pro seu processo.' },
  {
    n: '03',
    texto: 'Automações, tarefa manual vira rotina entre sistema, WhatsApp e planilha.',
  },
  { n: '04', texto: 'Tráfego pago, Google e Meta Ads com captação real de cliente.' },
  { n: '05', texto: 'Manutenção contínua, sempre por perto depois do site no ar.' },
  { n: '06', texto: 'Suporte direto com quem constrói e com quem cuida do anúncio.' },
];

export function Ato3Solucao() {
  const ref = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const raiz = ref.current;
      const alvo = palco.current;
      if (!raiz || !alvo) return;

      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cartoes = gsap.utils.toArray<HTMLElement>(`.${s.cartao}`);

      // Menos movimento: nada de pin, nada de scrub. A seção vira uma lista
      // comum e continua legível do começo ao fim.
      if (reduzido) {
        gsap.set(cartoes, { opacity: 1, y: 0 });
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
    { scope: ref },
  );

  return (
    <section className={s.raiz} id="ato-solucao" ref={ref} aria-labelledby="ato-solucao-rotulo">
      <div className={s.palco} ref={palco}>
        <div className={`container ${s.interno}`}>
          <header className={s.cabecalho}>
            <div className={s.marcacao}>
              <span className={s.numero}>03</span>
              <span className={s.traco} aria-hidden="true" />
              <span className={s.nome} id="ato-solucao-rotulo">
                A solução
              </span>
            </div>
            <Eyebrow>Onde as pontas se juntam</Eyebrow>
            <SplitWords texto="Seis frentes, uma equipe só." como="h2" className={s.titulo} />
          </header>

          <div className={s.blocos}>
            {FRENTES.map((frente) => (
              <article key={frente.n} className={s.cartao}>
                <span className={s.indice}>{frente.n}</span>
                <p className={s.cartaoTexto}>{frente.texto}</p>
              </article>
            ))}
          </div>

          <p className={s.nota}>
            <Placeholder>
              [O QUE ESTÁ INCLUSO · confirmar com a Atlas o que entra em cada frente e o
              que fica de fora]
            </Placeholder>
          </p>

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
