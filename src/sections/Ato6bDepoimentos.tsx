'use client';

import { useState } from 'react';
import { Ato } from '@/components/ui/Ato';
import { SplitWords } from '@/components/ui/SplitWords';
import { Avatar } from '@/components/ui/Avatar';
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
  logo: string;
  texto: string;
}[] = [
  {
    nome: 'Mariana Costa',
    cargo: 'Sócia',
    empresa: 'Studio MC Arquitetura',
    logo: '/logos/studio-mc.svg',
    texto:
      'Depois que começamos a trabalhar com a Atlas, ficou muito mais fácil organizar nossa presença digital. O processo é claro e o resultado começou a aparecer rapidamente.',
  },
  {
    nome: 'Rafael Almeida',
    cargo: 'Diretor comercial',
    empresa: 'Almeida Representações',
    logo: '/logos/almeida.svg',
    texto:
      'Gostei principalmente da integração entre site, anúncios e automação. Antes cada coisa funcionava de um jeito. Agora temos uma estratégia muito mais organizada.',
  },
  {
    nome: 'Camila Rodrigues',
    cargo: 'Fundadora',
    empresa: 'Camila Rodrigues Odontologia',
    logo: '/logos/camila-rodrigues.svg',
    texto:
      'A Atlas conseguiu entender exatamente o que nossa empresa precisava. O novo site ficou muito mais profissional e começamos a receber contatos mais qualificados.',
  },
  {
    nome: 'Lucas Martins',
    cargo: 'Sócio',
    empresa: 'Martins Contabilidade',
    logo: '/logos/martins.svg',
    texto:
      'Estávamos investindo em tráfego, mas sentíamos que os clientes se perdiam no caminho. Depois da implementação, a jornada ficou muito mais clara.',
  },
  {
    nome: 'Fernanda Oliveira',
    cargo: 'Gerente de marketing',
    empresa: 'Grupo Oliveira Móveis',
    logo: '/logos/grupo-oliveira.svg',
    texto:
      'O atendimento foi um dos pontos que mais me surpreendeu. Eles realmente entenderam o problema antes de sair oferecendo uma solução pronta.',
  },
  {
    nome: 'Bruno Ferreira',
    cargo: 'Diretor',
    empresa: 'Ferreira Engenharia',
    logo: '/logos/ferreira.svg',
    texto:
      'Nosso antigo site não transmitia o tamanho da empresa. A Atlas mudou completamente essa percepção e ainda deixou tudo muito mais funcional.',
  },
  {
    nome: 'Gabriel Santos',
    cargo: 'Sócio',
    empresa: 'Santos Consultoria',
    logo: '/logos/santos.svg',
    texto:
      'Começamos com uma demanda específica e acabamos percebendo que dava pra melhorar praticamente toda nossa operação digital. O resultado ficou acima do esperado.',
  },
  {
    nome: 'Juliana Mendes',
    cargo: 'Coordenadora de marketing',
    empresa: 'Mendes Estética',
    logo: '/logos/mendes.svg',
    texto:
      'Hoje conseguimos acompanhar melhor de onde estão vindo nossos clientes e o que acontece depois que eles entram em contato. Isso mudou bastante nossa tomada de decisão.',
  },
  {
    nome: 'André Carvalho',
    cargo: 'Fundador',
    empresa: 'Carvalho Advocacia',
    logo: '/logos/carvalho.svg',
    texto:
      'Gostei porque não ficou só no visual. O projeto ficou bonito, mas principalmente pensado pra gerar resultado e facilitar a conversão.',
  },
  {
    nome: 'Beatriz Nogueira',
    cargo: 'Sócia',
    empresa: 'Nogueira Studio de Pilates',
    logo: '/logos/nogueira.svg',
    texto:
      'Foi uma experiência muito diferente do que tivemos com outras empresas. Comunicação direta, execução rápida e uma solução realmente adaptada ao nosso negócio.',
  },
];

export function Ato6bDepoimentos() {
  const [pressionado, setPressionado] = useState(false);
  return (
    <Ato id="ato-depoimentos" rotulo="Depoimentos">
      <SplitWords texto="O que as empresas dizem depois do projeto no ar." como="h2" className={s.titulo} />

      <p className={s.aviso}>Depoimentos fictícios de demonstração</p>
      <div className={s.faixa} data-pressionado={pressionado}
        onPointerDown={(event) => { if (event.pointerType !== 'mouse') setPressionado(true); }}
        onPointerUp={() => setPressionado(false)}
        onPointerCancel={() => setPressionado(false)}
        onPointerLeave={() => setPressionado(false)}>
        {Array.from({ length: 4 }, (_, copia) => (
          <div className={s.grupo} key={copia} aria-hidden={copia > 0 ? true : undefined}>
            {DEPOIMENTOS.map((d) => (
              <div className={s.item} key={d.nome}>
                <article className={s.card}>
                  <div className={s.assinatura}>
                    <Avatar nome={d.nome} />
                    <span><span className={s.nome}>{d.nome}</span><span className={s.cargo}>{d.cargo}</span></span>
                  </div>
                  <p className={s.texto}>{d.texto}</p>
                </article>
                <div className={s.marca}><img src={d.logo} alt={d.empresa} width="200" height="80" loading="lazy" /></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Ato>
  );
}
