'use client';

import { Ato } from '@/components/ui/Ato';
import { Reveal } from '@/components/ui/Reveal';
import { Acordeao, type ItemFaq } from '@/components/ui/Acordeao';
import s from './Ato8Oferta.module.css';

const OBJECOES = [
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
  {
    pergunta: 'Mas eu não sei exatamente do que preciso.',
    resposta:
      'Não precisa chegar com uma solução pronta. A gente entende o cenário, identifica o que está travando e propõe o caminho que faz sentido agora.',
  },
  {
    pergunta: 'Mas como eu acompanho a evolução?',
    resposta:
      'Todo mês, fazemos uma reunião de acompanhamento. Você recebe um relatório claro sobre o que evoluiu, o que precisa de atenção e os próximos passos.',
  },
  {
    pergunta: 'Mas eu não tenho tempo para acompanhar tudo.',
    resposta:
      'Você participa das decisões importantes, sem precisar virar gerente do projeto. A gente organiza o processo e mantém você informado em cada etapa.',
  },
];

const FAQ: ItemFaq[] = [
  {
    pergunta: 'Quanto tempo leva pra ter o site no ar?',
    resposta: '15 a 30 dias, conforme o combinado com você.',
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
    resposta: 'Sim, o processo é remoto, do que foi combinado até a entrega.',
  },
];

export function Ato8Oferta() {
  return (
    <Ato id="ato-oferta" rotulo="Como funciona" claro>
      <Reveal className={s.oferta} duracao={0.82}>
        <div>
          <p>
            Tudo começa com uma conversa simples sobre o seu problema. Depois disso, você
            recebe por escrito o que vai ser feito, o prazo e o valor, e só começa quando
            aprovar. Você acompanha a construção antes de qualquer coisa ir pro ar, e o
            suporte continua depois da entrega.
          </p>
          <p className={s.prazo}>
            Prazo de entrega de site, 15 a 30 dias, conforme o combinado. Demais frentes e
            valores, sob conversa direta com a Atlas.
          </p>
        </div>
      </Reveal>

      <div className={s.objecoes}>
        <h3 className={s.subtitulo}>As seis perguntas que todo mundo faz</h3>
        <div className={s.objecoesGrade}>
          {OBJECOES.map((o) => (
            <div key={o.pergunta} className={s.objecao} data-duvida-card>
              <p className={s.objecaoPergunta}>{o.pergunta}</p>
              <p className={s.objecaoResposta}>{o.resposta}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={s.faq}>
        <h3 className={`${s.subtitulo} ${s.subtituloFaq}`}>Antes de você perguntar</h3>
        <Acordeao itens={FAQ} idBase="faq-atlas" />
      </div>
    </Ato>
  );
}
