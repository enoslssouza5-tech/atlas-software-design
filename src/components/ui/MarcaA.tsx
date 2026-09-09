type Props = {
  className?: string;
  /** true = traço aberto, pronto pra animação de desenho (stroke-dasharray) */
  tracado?: boolean;
  titulo?: string;
};

/**
 * Monograma "A" da Atlas.
 *
 * [ASSET · logo vetorial oficial em alta, fundo transparente]
 * Enquanto o arquivo original não chega, este monograma geométrico segura a
 * composição. É desenhado em traço pra permitir a animação de contorno do
 * preloader e o relevo do crachá 3D sem depender de imagem externa.
 */
export function MarcaA({ className, tracado = false, titulo }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={titulo ? 'img' : 'presentation'}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      fill="none"
    >
      <path
        d="M6 94 L50 6 L94 94"
        stroke="currentColor"
        strokeWidth={tracado ? 5 : 7}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M25 64 L75 64"
        stroke="currentColor"
        strokeWidth={tracado ? 5 : 7}
        strokeLinecap="square"
      />
    </svg>
  );
}
