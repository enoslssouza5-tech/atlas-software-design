import s from './TelaCelularFake.module.css';

type Props = {
  /** matiz base da tela fictícia, em graus, mesma lógica do NotebookMockup */
  matiz: number;
  titulo: string;
};

/**
 * Conteúdo fictício da tela do celular, pensado pra entrar como `children`
 * do `IphoneMockup`. Mesma composição genérica do notebook, versão vertical.
 */
export function TelaCelularFake({ matiz, titulo }: Props) {
  const tema = { '--matiz': String(matiz) } as React.CSSProperties;

  return (
    <div className={s.raiz} style={tema} aria-hidden="true" data-mockup={titulo}>
      <span className={s.heroFalso} />
      <span className={s.linha} />
      <span className={s.linhaCurta} />
      <span className={s.botaoFalso} />
    </div>
  );
}
