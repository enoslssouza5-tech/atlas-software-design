import s from './NotebookMockup.module.css';

type Props = {
  /** matiz base da tela fictícia, em graus */
  matiz: number;
  titulo: string;
};

/**
 * Notebook desenhado em CSS puro.
 *
 * [ASSET · prints reais dos projetos]. Até eles chegarem, a tela é uma
 * composição genérica de propósito: um mockup convincente demais seria
 * lido como cliente real.
 */
export function NotebookMockup({ matiz, titulo }: Props) {
  const tela = {
    '--matiz': String(matiz),
  } as React.CSSProperties;

  return (
    <div className={s.raiz} style={tela} aria-hidden="true" data-mockup={titulo}>
      <div className={s.telaNotebook}>
        <span className={s.barra} />
        <span className={s.heroFalso} />
        <span className={s.linha} />
        <span className={s.linhaCurta} />
        <div className={s.blocos}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className={s.base} />
    </div>
  );
}
