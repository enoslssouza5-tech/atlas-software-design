'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { SplitWords } from '@/components/ui/SplitWords';
import { NotebookMockup } from '@/components/ui/NotebookMockup';
import { IphoneMockup } from '@/components/ui/IphoneMockup';
import { TelaCelularFake } from '@/components/ui/TelaCelularFake';
import { useDeviceTier } from '@/lib/use-device-tier';
import { DUR, EASE } from '@/lib/motion-tokens';
import s from './Ato5Projetos.module.css';

/**
 * ATO 5: PROJETOS
 *
 * Notebook e celular persistentes, não um carrossel de cartões. O mesmo
 * ScrollTrigger pinado dirige duas coisas em sequência: primeiro o
 * notebook abre (rotateX de ~100° a 0°), depois o celular entra e os dois
 * avançam juntos pelos sete projetos, pelo mesmo índice de progresso.
 *
 * No mobile some o notebook, só o celular centralizado troca de projeto
 * pelo scroll, mesmo mecanismo, sem a fase de abertura.
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

/** fração do progresso total dedicada a abrir o notebook, só no desktop */
const FASE1_FRACAO = 0.18;

/**
 * `transform: scale()` não muda a caixa de layout do `IphoneMockup` (ele
 * continua ocupando o tamanho nativo em pixels pro navegador), então o
 * contêiner que o posiciona precisa de largura/altura explícitas batendo
 * com o tamanho final visual, calculadas aqui em vez de chutadas em CSS.
 */
const CELULAR_NATIVO = { largura: 393 + 12 * 2, altura: 852 + 12 * 2 };

export function Ato5Projetos() {
  const ref = useRef<HTMLElement>(null);
  const notebookRef = useRef<HTMLDivElement>(null);
  const celularRef = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const [indiceAtual, setIndiceAtual] = useState(0);

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz || !tier.pronto) return;

      const notebook = notebookRef.current;
      const celular = celularRef.current;

      if (tier.reduzido) {
        // Estático: mostra o primeiro projeto, sem pin, sem giro do notebook.
        if (notebook) gsap.set(notebook, { rotateX: 0 });
        if (celular) gsap.set(celular, { opacity: 1, y: 0 });
        return;
      }

      const fase1Fim = tier.mobile ? 0 : FASE1_FRACAO;
      const distanciaTotal = () =>
        tier.mobile
          ? window.innerHeight * 0.62 * PROJETOS.length
          : window.innerHeight * 0.7 + window.innerHeight * 0.6 * PROJETOS.length;

      let indiceRenderizado = 0;
      let celularRevelado = tier.mobile;

      if (!tier.mobile && notebook) {
        gsap.set(notebook, { transformPerspective: 1400, transformOrigin: '50% 100%', rotateX: 100 });
      }
      if (celular) {
        gsap.set(celular, { opacity: tier.mobile ? 1 : 0, y: tier.mobile ? 0 : 24 });
      }

      const pontosDeSnap = tier.mobile
        ? PROJETOS.map((_, i) => i / (PROJETOS.length - 1))
        : [0, ...PROJETOS.map((_, i) => fase1Fim + (i / (PROJETOS.length - 1)) * (1 - fase1Fim))];

      const st = ScrollTrigger.create({
        trigger: raiz,
        start: 'top top',
        end: () => '+=' + distanciaTotal(),
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        // O ScrollTrigger recalcula na ordem de CRIAÇÃO, não na ordem da
        // página. Este pin nasce depois de todos os atos abaixo dele (o
        // device tier resolve async), então sem prioridade explícita os
        // atos 6 a 9 se mediriam antes do espaçador existir.
        refreshPriority: 1,
        snap: { snapTo: pontosDeSnap, duration: 0.42, ease: EASE.entrada },
        onUpdate: (self) => {
          const p = self.progress;

          if (!tier.mobile && notebook) {
            const f1 = fase1Fim > 0 ? Math.min(1, p / fase1Fim) : 1;
            gsap.set(notebook, { rotateX: 100 * (1 - f1) });
          }

          if (!celularRevelado && p > fase1Fim) {
            celularRevelado = true;
            if (celular) gsap.to(celular, { opacity: 1, y: 0, duration: 0.5, ease: EASE.entrada });
          }

          const f2 = fase1Fim < 1 ? Math.max(0, (p - fase1Fim) / (1 - fase1Fim)) : 0;
          const indice = Math.min(PROJETOS.length - 1, Math.floor(f2 * PROJETOS.length));
          if (indice !== indiceRenderizado) {
            indiceRenderizado = indice;
            setIndiceAtual(indice);
          }
        },
      });

      // Refresh fora da pilha atual de propósito: chamado aqui dentro, cai
      // no guard de reentrância do ScrollTrigger e é descartado em silêncio.
      const refresco = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(refresco);
        st.kill();
      };
    },
    { scope: ref, dependencies: [tier.pronto, tier.mobile, tier.reduzido] },
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

  const projeto = PROJETOS[indiceAtual];
  const escalaCelular = tier.mobile ? 0.56 : 0.32;
  const celularEstilo = {
    width: CELULAR_NATIVO.largura * escalaCelular,
    height: CELULAR_NATIVO.altura * escalaCelular,
  };

  return (
    <section className={s.raiz} id="ato-projetos" ref={ref} aria-labelledby="ato-projetos-rotulo">
      <div className={s.palco}>
        <div className={`container ${s.cabecalho}`}>
          <span className="sr-only" id="ato-projetos-rotulo">
            Projetos
          </span>
          <SplitWords
            texto="Sete demonstrações, sete setores."
            como="h2"
            className={s.titulo}
          />
        </div>

        <div className={`container ${s.composicao}`}>
          <div className={s.notebookWrap} ref={notebookRef}>
            <NotebookMockup matiz={projeto.matiz} titulo={projeto.titulo} />
          </div>
          <div className={s.celularWrap} ref={celularRef} style={celularEstilo}>
            <IphoneMockup model="15-pro" color="space-black" scale={escalaCelular}>
              <TelaCelularFake matiz={projeto.matiz} titulo={projeto.titulo} />
            </IphoneMockup>
          </div>
        </div>

        <div className={`container ${s.info}`}>
          <span className={s.nicho}>
            <span className={s.indice}>{projeto.n}</span>
            {projeto.nicho}
          </span>
          <h3 className={s.cartaoTitulo}>{projeto.titulo}</h3>
          <p className={s.escopo}>{projeto.escopo}</p>
          <span className={s.ficticio}>Mockup fictício de demonstração</span>
        </div>
      </div>
    </section>
  );
}
