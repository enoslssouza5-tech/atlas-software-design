'use client';

import { Star, Ruler, Handshake, Smile, Calculator, Armchair, Wrench, Compass, Sparkles, Scale, PersonStanding } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { Reveal } from '@/components/ui/Reveal';
import { Avatar } from '@/components/ui/Avatar';
import { Marquee } from '@/components/ui/Marquee';
import { DIST, DUR } from '@/lib/motion-tokens';
import s from './Ato6bDepoimentos.module.css';

/**
 * Depoimentos fictícios de demonstração, mesma lógica dos projetos do Ato 5:
 * nome, cargo, empresa e marca de cada empresa inventados pra mostrar o
 * formato do card, nunca passados como reais. Nenhum depoimento real entra
 * aqui sem consentimento por escrito.
 */
const DEPOIMENTOS: {
  nome: string;
  cargo: string;
  empresa: string;
  Icone: LucideIcon;
  texto: string;
}[] = [
  {
    nome: 'Mariana Costa',
    cargo: 'Sócia',
    empresa: 'Studio MC Arquitetura',
    Icone: Ruler,
    texto:
      'Depois que começamos a trabalhar com a Atlas, ficou muito mais fácil organizar nossa presença digital. O processo é claro e o resultado começou a aparecer rapidamente.',
  },
  {
    nome: 'Rafael Almeida',
    cargo: 'Diretor comercial',
    empresa: 'Almeida Representações',
    Icone: Handshake,
    texto:
      'Gostei principalmente da integração entre site, anúncios e automação. Antes cada coisa funcionava de um jeito. Agora temos uma estratégia muito mais organizada.',
  },
  {
    nome: 'Camila Rodrigues',
    cargo: 'Fundadora',
    empresa: 'Camila Rodrigues Odontologia',
    Icone: Smile,
    texto:
      'A Atlas conseguiu entender exatamente o que nossa empresa precisava. O novo site ficou muito mais profissional e começamos a receber contatos mais qualificados.',
  },
  {
    nome: 'Lucas Martins',
    cargo: 'Sócio',
    empresa: 'Martins Contabilidade',
    Icone: Calculator,
    texto:
      'Estávamos investindo em tráfego, mas sentíamos que os clientes se perdiam no caminho. Depois da implementação, a jornada ficou muito mais clara.',
  },
  {
    nome: 'Fernanda Oliveira',
    cargo: 'Gerente de marketing',
    empresa: 'Grupo Oliveira Móveis',
    Icone: Armchair,
    texto:
      'O atendimento foi um dos pontos que mais me surpreendeu. Eles realmente entenderam o problema antes de sair oferecendo uma solução pronta.',
  },
  {
    nome: 'Bruno Ferreira',
    cargo: 'Diretor',
    empresa: 'Ferreira Engenharia',
    Icone: Wrench,
    texto:
      'Nosso antigo site não transmitia o tamanho da empresa. A Atlas mudou completamente essa percepção e ainda deixou tudo muito mais funcional.',
  },
  {
    nome: 'Gabriel Santos',
    cargo: 'Sócio',
    empresa: 'Santos Consultoria',
    Icone: Compass,
    texto:
      'Começamos com uma demanda específica e acabamos percebendo que dava pra melhorar praticamente toda nossa operação digital. O resultado ficou acima do esperado.',
  },
  {
    nome: 'Juliana Mendes',
    cargo: 'Coordenadora de marketing',
    empresa: 'Mendes Estética',
    Icone: Sparkles,
    texto:
      'Hoje conseguimos acompanhar melhor de onde estão vindo nossos clientes e o que acontece depois que eles entram em contato. Isso mudou bastante nossa tomada de decisão.',
  },
  {
    nome: 'André Carvalho',
    cargo: 'Fundador',
    empresa: 'Carvalho Advocacia',
    Icone: Scale,
    texto:
      'Gostei porque não ficou só no visual. O projeto ficou bonito, mas principalmente pensado pra gerar resultado e facilitar a conversão.',
  },
  {
    nome: 'Beatriz Nogueira',
    cargo: 'Sócia',
    empresa: 'Nogueira Studio de Pilates',
    Icone: PersonStanding,
    texto:
      'Foi uma experiência muito diferente do que tivemos com outras empresas. Comunicação direta, execução rápida e uma solução realmente adaptada ao nosso negócio.',
  },
];

export function Ato6bDepoimentos() {
  return (
    <Ato id="ato-depoimentos" rotulo="Depoimentos">
      <SplitWords texto="O que as empresas dizem depois do projeto no ar." como="h2" className={s.titulo} />

      <Reveal distancia={DIST.curto} duracao={DUR.longa} className={s.envoltorioFaixa}>
        <Marquee>
          {DEPOIMENTOS.map((d) => (
            <article key={d.nome} className={s.card}>
              <div className={s.estrelas} aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className={s.texto}>{d.texto}</p>
              <div className={s.assinatura}>
                <Avatar nome={d.nome} />
                <span>
                  <span className={s.nome}>{d.nome}</span>
                  <span className={s.cargo}>
                    {d.cargo}, {d.empresa}
                  </span>
                </span>
              </div>
              <div className={s.marca} aria-hidden="true">
                <d.Icone size={16} strokeWidth={1.5} />
                <span className={s.marcaNome}>{d.empresa}</span>
              </div>
            </article>
          ))}
        </Marquee>
      </Reveal>
    </Ato>
  );
}
