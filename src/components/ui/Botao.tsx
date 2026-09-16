'use client';

import type { ReactNode } from 'react';
import s from './Botao.module.css';

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variante?: 'primario' | 'fantasma';
  className?: string;
  aria?: string;
};

/**
 * Botão de filete laranja. O laranja é contorno em repouso e um
 * preenchimento translúcido no hover, a mesma receita do item ativo da
 * cápsula do menu, nunca área sólida grande.
 * O hover é a única exceção da regra de duração: 0.22s, via CSS, porque é
 * micro-interação e não animação de entrada.
 */
export function Botao({
  children,
  href,
  onClick,
  variante = 'primario',
  className,
  aria,
}: Props) {
  const classe = [s.raiz, s[variante], className].filter(Boolean).join(' ');
  const conteudo = (
    <>
      <span className={s.texto}>{children}</span>
      <span className={s.seta} aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
          <path
            d="M2 8h11M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classe} aria-label={aria}>
        {conteudo}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classe} aria-label={aria}>
      {conteudo}
    </button>
  );
}
