'use client';

import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { Acordeao, type ItemFaq } from '@/components/ui/Acordeao';
import { Placeholder } from '@/components/ui/Placeholder';
import s from './Ato8Oferta.module.css';

/**
 * ATO 8 — OFERTA, OBJEÇÕES E FAQ
 *
 * Segundo e último respiro claro da jornada. O momento comercial é o único
 * que a página trata com luz acesa.
 *
 * Nenhuma resposta aqui promete prazo, preço ou resultado. Onde um número
 * seria necessário, existe um placeholder — porque prometer o que não foi
 * confirmado é propaganda enganosa, não copy persuasiva.
 */

const ETAPAS = [
  {
    n: '01',
    titulo: 'Conversa',
    texto: 'Você conta o problema. A Atlas escuta e diz se é caso pra site, sistema ou automação — inclusive quando a resposta é nenhum dos três.',
  },
  {
    n: '02',
    titulo: 'Escopo escrito',
    texto: 'O que entra, o que não entra, prazo e valor num documento só. Nada começa antes de você ler e concordar.',
  },
  {
    n: '03',
    titulo: 'Construção',
    texto: 'Você acompanha o que está sendo feito em ambiente de teste, antes de qualquer coisa ir pro ar.',
  },
  {
    n: '04',
    titulo: 'Entrega e depois',
    texto: 'Publicação, documentação e acompanhamento. O contato continua o mesmo do primeiro dia.',
  },
];

const OBJECOES = [
  {
    pergunta: 'Quanto tempo leva?',
    resposta:
      'Depende do escopo, e você recebe a data por escrito antes de assinar qualquer coisa — não durante o projeto.',
    falta: '[PRAZO · faixa real por tipo de projeto: site, sistema, automação]',
  },
  {
    pergunta: 'Quanto custa?',
    resposta:
      'O valor fecha junto com o escopo. Não existe cobrança nova por item que já estava combinado no documento inicial.',
    falta: '[PREÇO · modelo real: pacote fechado, por escopo ou sob consulta]',
  },
  {
    pergunta: 'E depois que entra no ar?',
    resposta:
      'O acompanhamento faz parte da entrega. Correção do que foi entregue não vira orçamento novo.',
    falta: '[SUPORTE · janela real de atendimento e o que cobre]',
  },
];

const FAQ: ItemFaq[] = [
  {
    pergunta: 'Já tenho um site. Vocês mexem no que existe ou refazem tudo?',
    resposta:
      'Os dois cenários acontecem. A Atlas abre o que existe, avalia se a base se sustenta e diz com franqueza qual dos dois caminhos custa menos pra você — mesmo quando o caminho mais barato é o que dá menos trabalho pra ela.',
  },
  {
    pergunta: 'Preciso ter o conteúdo pronto antes de começar?',
    resposta:
      'Não pra começar. A estrutura da página é definida junto com você e os espaços de texto e imagem ficam marcados até o conteúdo chegar. O que não acontece é a Atlas inventar informação sobre a sua empresa pra preencher espaço.',
  },
  {
    pergunta: 'Quem fica com o domínio, a hospedagem e o código?',
    resposta:
      'Você. Domínio e hospedagem ficam registrados no seu nome, com o seu acesso, e o repositório do código é entregue junto. Sair da Atlas não deve custar o seu site.',
  },
  {
    pergunta: 'Consigo editar textos e imagens sem chamar vocês?',
    resposta:
      'Nos projetos com painel, sim — e a documentação da entrega explica exatamente onde mexer e o que não tocar. Alteração estrutural continua sendo trabalho de desenvolvimento.',
  },
  {
    pergunta: 'Vocês dão manutenção em projeto feito por outra pessoa?',
    resposta:
      'Sim, depois de uma leitura do código atual. Em alguns casos essa leitura mostra que manter sai mais caro que refazer, e isso é dito antes de qualquer proposta.',
  },
  {
    pergunta: 'Atendem empresas de fora da região?',
    resposta:
      'Sim. Todo o processo funciona remoto, do escopo à entrega. [REGIÃO · confirmar se a Atlas quer priorizar alguma cidade ou estado na comunicação.]',
  },
];

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
          <p className={s.ofertaTexto}>
            O trabalho começa por um escopo escrito. Você lê, ajusta e só então o projeto
            entra na fila.
          </p>
          <Placeholder bloco>
            [OFERTA · definir o formato real que a Atlas pratica: pacote fechado por tipo
            de projeto, orçamento por escopo, mensalidade de evolução ou proposta sob
            consulta]
          </Placeholder>
        </div>
      </Reveal>

      <ol className={s.etapas}>
        {ETAPAS.map((e) => (
          <li key={e.n} className={s.etapa}>
            <span className={s.etapaNumero}>{e.n}</span>
            <h3 className={s.etapaTitulo}>{e.titulo}</h3>
            <p className={s.etapaTexto}>{e.texto}</p>
          </li>
        ))}
      </ol>

      <div className={s.objecoes}>
        <h3 className={s.subtitulo}>As três perguntas que todo mundo faz</h3>
        <div className={s.objecoesGrade}>
          {OBJECOES.map((o) => (
            <div key={o.pergunta} className={s.objecao}>
              <p className={s.objecaoPergunta}>{o.pergunta}</p>
              <p className={s.objecaoResposta}>{o.resposta}</p>
              <Placeholder>{o.falta}</Placeholder>
            </div>
          ))}
        </div>
      </div>

      <div className={s.faq}>
        <h3 className={s.subtitulo}>Outras dúvidas</h3>
        <Acordeao itens={FAQ} idBase="faq-atlas" />
      </div>
    </Ato>
  );
}
