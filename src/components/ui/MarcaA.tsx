type Props = {
  className?: string;
  titulo?: string;
};

/**
 * Logo real da Atlas, arquivo rasterizado com fundo transparente
 * (public/logo.png, 500x500). width/height explícitos no tamanho quadrado
 * real da imagem evitam esticar ou borrar em qualquer lugar onde apareça.
 */
export function MarcaA({ className, titulo }: Props) {
  return (
    <img
      src="/logo.png"
      alt={titulo ?? ''}
      className={className}
      width={500}
      height={500}
      loading="eager"
    />
  );
}
