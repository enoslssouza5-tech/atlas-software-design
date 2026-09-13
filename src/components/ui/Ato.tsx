import type { ReactNode } from 'react';
import s from './Ato.module.css';

type Props = {
  id: string;
  /** nome acessível da seção, só existe pra leitor de tela */
  rotulo: string;
  children: ReactNode;
  /** fundo claro: usado em 1 ou 2 momentos da jornada, nunca alternado */
  claro?: boolean;
  className?: string;
};

/**
 * Moldura comum dos atos.
 *
 * A marcação numerada "01 / Abertura" que existia aqui foi removida da
 * tela: o nome da seção continua existindo só pra acessibilidade, via
 * `aria-labelledby` apontando pra um span `sr-only`. Os rótulos (eyebrow)
 * acima de cada H2 são outra coisa, ficam em `children`, não são tocados
 * por este componente.
 */
export function Ato({ id, rotulo, children, claro = false, className }: Props) {
  return (
    <section
      id={id}
      className={[s.raiz, claro ? s.claro : '', className].filter(Boolean).join(' ')}
      data-tom={claro ? 'claro' : 'escuro'}
      aria-labelledby={`${id}-rotulo`}
    >
      <div className="container">
        <span className="sr-only" id={`${id}-rotulo`}>
          {rotulo}
        </span>
        {children}
      </div>
    </section>
  );
}
