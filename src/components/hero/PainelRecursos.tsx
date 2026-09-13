import { Monitor, LayoutGrid, Settings, TrendingUp } from 'lucide-react';
import s from './PainelRecursos.module.css';

const RECURSOS = [
  {
    Icone: Monitor,
    titulo: 'Websites',
    descricao: 'Institucionais, landing pages e catálogos.',
  },
  {
    Icone: LayoutGrid,
    titulo: 'Sistemas',
    descricao: 'Painel interno, área de cliente, cadastro.',
  },
  {
    Icone: Settings,
    titulo: 'Automações',
    descricao: 'Entre sistemas, WhatsApp e planilha.',
  },
  {
    Icone: TrendingUp,
    titulo: 'Tráfego Pago',
    descricao: 'Prospecção e captação de clientes via Google e Meta Ads.',
  },
];

/**
 * Recria em HTML real os quatro cartões já desenhados na própria foto de
 * fundo do Hero (o mesmo conteúdo visual, agora nítido em qualquer zoom).
 * Só desktop: a foto do mobile não tem esse desenho por baixo.
 */
export function PainelRecursos() {
  return (
    <div className={s.raiz} aria-hidden="true">
      {RECURSOS.map(({ Icone, titulo, descricao }) => (
        <div className={s.cartao} key={titulo}>
          <div className={s.icone}>
            <Icone size={18} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className={s.texto}>
            <p className={s.titulo}>{titulo}</p>
            <p className={s.descricao}>{descricao}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
