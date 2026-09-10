'use client';

import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { Acordeao, type ItemFaq } from '@/components/ui/Acordeao';
import s from './Ato8Oferta.module.css';

/**
 * ATO 8: OFERTA, OBJEÇÕES E FAQ
 *
 * Segundo e último respiro claro da jornada. O momento comercial é o único
 * que a página trata com luz acesa.
 *
 * Todo número, prazo e afirmação aqui vem do briefing aprovado pelo cliente.
 * Nada foi inventado por esta camada de copy.
 */

const OFERTA_ITENS = [
  'Diagnóstico do que sua empresa já tem hoje, site, sistema, anúncio.',
  'Escopo escrito com o que entra, o que não entra, e prazo.',
  'Construção acompanhada pela nossa equipe em ambiente de teste antes de ir pro ar.',
  'Entrega documentada, com suporte contínuo da nossa equipe depois do deploy.',
];

const OBJECOES = [
  {
    pergunta: 'Mas eu já tenho site.',
    resposta:
      'Os dois cenários acontecem, mexer no que existe ou refazer do zero. A Atlas abre o que você já tem, avalia se a base se sustenta e diz com franqueza qual caminho custa menos pra você, mesmo quando esse caminho dá menos trabalho pra ela.',
  },
  {
    pergunta: 'Mas eu não preciso de site, meu cliente vem pelo Instagram.',
    resposta:
      'Até aparecer o mês em que o Instagram muda o alcance de graça, ou o concorrente aparece primeiro na busca. Site e tráfego pago não competem com o Instagram, eles cobrem o que o Instagram não alcança.',
  },
  {
    pergunta: 'Mas eu não tenho o conteúdo pronto.',
    resposta:
      'Não precisa ter pra começar. A estrutura é definida junto com você, e os espaços de texto e imagem ficam marcados até o conteúdo chegar.',
  },
  {
    pergunta: 'Mas e se eu quiser sair da Atlas depois.',
    resposta: 'Domínio, hospedagem e código ficam no seu nome. Sair da Atlas não deve custar o seu site.',
  },
  {
    pergunta: 'Mas meu problema já foi resolvido por outra pessoa antes e não funcionou.',
    resposta:
      'A nossa equipe faz manutenção em projeto de terceiro, depois de ler o código atual. Em alguns casos essa leitura mostra que refazer sai mais barato que manter, e isso é dito antes de qualquer proposta.',
  },
];

const FAQ: ItemFaq[] = [
  {
    pergunta: 'Quanto tempo leva pra ter o site no ar?',
    resposta: '15 a 30 dias, conforme o escopo fechado com você.',
  },
  {
    pergunta: 'Quanto custa?',
    resposta:
      'Depende do que você precisa. Site, sistema, automação e tráfego pago têm formatos diferentes, o valor fecha numa conversa direta com a Atlas.',
  },
  {
    pergunta: 'Eu já tenho site, mexem no que existe ou têm que refazer tudo?',
    resposta: 'Os dois cenários acontecem, depende do que a base atual aguenta.',
  },
  {
    pergunta: 'Preciso ter conteúdo pronto antes de começar?',
    resposta: 'Não. A estrutura é definida junto, com espaço marcado até o conteúdo chegar.',
  },
  {
    pergunta: 'Quem fica com domínio, hospedagem e código?',
    resposta: 'Você, no seu nome, com seu acesso.',
  },
  {
    pergunta: 'Se eu precisar de um ajuste depois, como funciona?',
    resposta:
      'Nossa equipe está sempre pronta pra ajustar o que for preciso, sem você precisar aprender a mexer em nada.',
  },
  {
    pergunta: 'Quanto tempo vocês demoram pra responder?',
    resposta: 'Até 24 horas.',
  },
  {
    pergunta: 'Atendem empresa de fora da região?',
    resposta: 'Sim, o processo é remoto do escopo à entrega.',
  },
];

function IconeCheck() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={s.iconeCheck}>
      <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="M6.2 10.3 8.6 12.7 13.6 7.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Ato8Oferta() {
  return (
    <Ato id="ato-oferta" numero="08" rotulo="Como funciona" claro>
      <SplitWords
        texto="Sem reunião de descoberta que vira orçamento surpresa."
        como="h2"
        className={s.titulo}
      />

      <Reveal className={s.oferta} duracao={0.82}>
        <div>
          <ul className={s.ofertaLista}>
            {OFERTA_ITENS.map((item) => (
              <li key={item} className={s.ofertaItem}>
                <IconeCheck />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className={s.prazo}>
            Prazo de entrega de site, 15 a 30 dias, conforme escopo. Demais frentes e
            valores, sob conversa direta com a Atlas.
          </p>
        </div>
      </Reveal>

      <div className={s.objecoes}>
        <h3 className={s.subtitulo}>As cinco perguntas que todo mundo faz</h3>
        <div className={s.objecoesGrade}>
          {OBJECOES.map((o) => (
            <div key={o.pergunta} className={s.objecao}>
              <p className={s.objecaoPergunta}>{o.pergunta}</p>
              <p className={s.objecaoResposta}>{o.resposta}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={s.confianca}>
        <div className={s.confiancaItem}>
          <span className={s.confiancaRotulo}>Garantia</span>
          <p>
            Revisão sem custo se o resultado entregue não bater com o escopo assinado por
            escrito com o cliente.
          </p>
        </div>
        <div className={s.confiancaItem}>
          <span className={s.confiancaRotulo}>Urgência</span>
          <p>A Atlas responde todo contato em até 24 horas, sem fila de espera.</p>
        </div>
      </div>

      <div className={s.faq}>
        <h3 className={s.subtitulo}>Outras dúvidas</h3>
        <Acordeao itens={FAQ} idBase="faq-atlas" />
      </div>
    </Ato>
  );
}
