'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { SplitWords } from '@/components/ui/SplitWords';
import { Placeholder } from '@/components/ui/Placeholder';
import { CENAS, definirAlvo } from '@/lib/cena-signal';
import { useDeviceTier } from '@/lib/use-device-tier';
import { DIST, DUR, EASE } from '@/lib/motion-tokens';
import s from './Ato3Solucao.module.css';

/**
 * ATO 3 — REVELAÇÃO DA SOLUÇÃO
 *
 * Único trecho pinado da página. A seção mede 300vh, o palco fica preso em
 * 100vh e o scrub 1.2 dá o arrasto de câmera: o usuário empurra a cena, e ela
 * responde com um leve atraso, como um travelling pesado.
 *
 * O crachá reaparece de miniatura no canto — assinatura visual recorrente,
 * o mesmo objeto do Ato 1 visto de longe.
 */

const SERVICOS = [
  {
    n: '01',
    titulo: 'Websites',
    texto:
      'Institucional, landing page e catálogo. Escritos do zero em Next.js, com painel pra sua equipe editar texto e imagem sem abrir chamado.',
    marcas: ['Next.js', 'SEO técnico', 'Painel editável'],
  },
  {
    n: '02',
    titulo: 'Sistemas sob medida',
    texto:
      'Área de cliente, painel interno, controle de pedidos e cadastro. Feito em cima do processo que a sua empresa já usa, não do processo que o software impõe.',
    marcas: ['Área logada', 'Banco de dados', 'Relatórios'],
  },
  {
    n: '03',
    titulo: 'Automações',
    texto:
      'A tarefa repetida que consome a manhã de alguém vira rotina automática: integração entre sistemas, disparo de mensagem, planilha que se preenche sozinha.',
    marcas: ['n8n', 'Integrações', 'Rotinas agendadas'],
  },
  {
    n: '04',
    titulo: 'Depois do deploy',
    texto:
      'O projeto entra no ar documentado e continua acompanhado. Correção, ajuste e evolução fazem parte do contrato, não de um orçamento novo a cada pedido.',
    marcas: ['Documentação', 'Suporte', 'Evolução'],
  },
];

export function Ato3Solucao() {
  const ref = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const alvoCena = tier.mobile ? CENAS.miniaturaMobile : CENAS.miniatura;

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
          onToggle: (self) => {
            if (self.isActive) definirAlvo(alvoCena);
          },
          onLeave: () => definirAlvo(CENAS.oculto),
          onLeaveBack: () => definirAlvo(CENAS.oculto),
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
      // montando duas vezes, cada remontagem empilhava mais um espaçador — a
      // página crescia sozinha e todos os gatilhos abaixo saíam do lugar.
    },
    { scope: ref, dependencies: [alvoCena] },
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
            <SplitWords
              texto="Três frentes e uma promessa de continuidade."
              como="h2"
              className={s.titulo}
            />
          </header>

          <div className={s.blocos}>
            {SERVICOS.map((serv) => (
              <article key={serv.n} className={s.cartao}>
                <span className={s.indice}>{serv.n}</span>
                <h3 className={s.cartaoTitulo}>{serv.titulo}</h3>
                <p className={s.cartaoTexto}>{serv.texto}</p>
                <ul className={s.marcas}>
                  {serv.marcas.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className={s.nota}>
            <Placeholder>
              [ESCOPO · confirmar com a Atlas o que entra em cada frente e o que fica de fora]
            </Placeholder>
          </p>
        </div>
      </div>
    </section>
  );
}
