import s from './Placeholder.module.css';

/**
 * Marcador visível de conteúdo que ainda não foi confirmado pela Atlas.
 *
 * Existe pra ser incômodo de propósito: enquanto estiver na tela, aquele
 * pedaço da página não pode ir pro ar. Nunca substituir por texto inventado.
 */
export function Placeholder({
  children,
  bloco = false,
}: {
  children: React.ReactNode;
  bloco?: boolean;
}) {
  return (
    <span className={bloco ? `${s.raiz} ${s.bloco}` : s.raiz} data-placeholder="true">
      {children}
    </span>
  );
}
