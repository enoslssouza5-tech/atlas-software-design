import s from './Avatar.module.css';

type Props = { nome: string; className?: string };

/**
 * Sem foto real de cliente fictício: círculo com a inicial do nome, no
 * mesmo espírito de um `AvatarFallback`.
 */
export function Avatar({ nome, className }: Props) {
  const inicial = nome.trim().charAt(0).toUpperCase();

  return (
    <span className={[s.avatar, className].filter(Boolean).join(' ')} aria-hidden="true">
      {inicial}
    </span>
  );
}
