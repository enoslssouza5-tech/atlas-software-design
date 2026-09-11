'use client';

import { useRef } from 'react';
import { Star } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Placeholder } from '@/components/ui/Placeholder';
import { STAGGER } from '@/lib/motion-tokens';
import s from './Ato6bDepoimentos.module.css';

/**
 * Depoimentos fictícios de demonstração, mesma lógica dos sete projetos do
 * Ato 5, nome, cargo e empresa inventados pra mostrar o formato do card,
 * nunca passados como reais. Cada card carrega a etiqueta visível de
 * demonstração, e nenhum depoimento real entra aqui sem consentimento por
 * escrito, essa seção continua sendo só o Ato 6.
 */
const DEPOIMENTOS = [
  {
    nome: 'Mariana Costa',
    cargo: 'Sócia, Studio MC Arquitetura',
    texto:
      'Depois que começamos a trabalhar com a Atlas, ficou muito mais fácil organizar nossa presença digital. O processo é claro e o resultado começou a aparecer rapidamente.',
  },
  {
    nome: 'Rafael Almeida',
    cargo: 'Diretor comercial, Almeida Representações',
    texto:
      'Gostei principalmente da integração entre site, anúncios e automação. Antes cada coisa funcionava de um jeito. Agora temos uma estratégia muito mais organizada.',
  },
  {
    nome: 'Camila Rodrigues',
    cargo: 'Fundadora, Camila Rodrigues Odontologia',
    texto:
      'A Atlas conseguiu entender exatamente o que nossa empresa precisava. O novo site ficou muito mais profissional e começamos a receber contatos mais qualificados.',
  },
  {
    nome: 'Lucas Martins',
    cargo: 'Sócio, Martins Contabilidade',
    texto:
      'Estávamos investindo em tráfego, mas sentíamos que os clientes se perdiam no caminho. Depois da implementação, a jornada ficou muito mais clara.',
  },
  {
    nome: 'Fernanda Oliveira',
    cargo: 'Gerente de marketing, Grupo Oliveira Móveis',
    texto:
      'O atendimento foi um dos pontos que mais me surpreendeu. Eles realmente entenderam o problema antes de sair oferecendo uma solução pronta.',
  },
  {
    nome: 'Bruno Ferreira',
    cargo: 'Diretor, Ferreira Engenharia',
    texto:
      'Nosso antigo site não transmitia o tamanho da empresa. A Atlas mudou completamente essa percepção e ainda deixou tudo muito mais funcional.',
  },
  {
    nome: 'Gabriel Santos',
    cargo: 'Sócio, Santos Consultoria',
    texto:
      'Começamos com uma demanda específica e acabamos percebendo que dava pra melhorar praticamente toda nossa operação digital. O resultado ficou acima do esperado.',
  },
  {
    nome: 'Juliana Mendes',
    cargo: 'Coordenadora de marketing, Mendes Estética',
    texto:
      'Hoje conseguimos acompanhar melhor de onde estão vindo nossos clientes e o que acontece depois que eles entram em contato. Isso mudou bastante nossa tomada de decisão.',
  },
  {
    nome: 'André Carvalho',
    cargo: 'Fundador, Carvalho Advocacia',
    texto:
      'Gostei porque não ficou só no visual. O projeto ficou bonito, mas principalmente pensado pra gerar resultado e facilitar a conversão.',
  },
  {
    nome: 'Beatriz Nogueira',
    cargo: 'Sócia, Nogueira Studio de Pilates',
    texto:
      'Foi uma experiência muito diferente do que tivemos com outras empresas. Comunicação direta, execução rápida e uma solução realmente adaptada ao nosso negócio.',
  },
];

export function Ato6bDepoimentos() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        `.${s.card}`,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.82,
          ease: 'power3.out',
          stagger: STAGGER.apertado,
          scrollTrigger: { trigger: `.${s.grade}`, start: 'top 82%', once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <Ato id="ato-depoimentos" rotulo="Depoimentos">
        <Eyebrow>O que dizem</Eyebrow>
        <SplitWords
          texto="O que as empresas dizem depois do projeto no ar."
          como="h2"
          className={s.titulo}
        />
        <Placeholder bloco>
          [DEPOIMENTOS · os dez abaixo são fictícios de demonstração. Substituir por
          depoimentos reais, com consentimento por escrito de cada cliente]
        </Placeholder>

        <ul className={s.grade}>
          {DEPOIMENTOS.map((d) => (
            <li key={d.nome} className={s.card}>
              <div className={s.estrelas} aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className={s.texto}>{d.texto}</p>
              <div className={s.assinatura}>
                <span className={s.nome}>{d.nome}</span>
                <span className={s.cargo}>{d.cargo}</span>
              </div>
              <span className={s.ficticio}>Depoimento fictício de demonstração</span>
            </li>
          ))}
        </ul>
      </Ato>
    </div>
  );
}
