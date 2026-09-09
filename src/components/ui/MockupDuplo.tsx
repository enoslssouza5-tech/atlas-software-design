import s from './MockupDuplo.module.css';

type Props = {
  /** matiz base da tela fictícia, em graus */
  matiz: number;
  titulo: string;
};

/**
 * Notebook + celular lado a lado, desenhados em CSS.
 *
 * [ASSET · prints reais dos projetos] — até eles chegarem, a tela é uma
 * composição genérica. É de propósito que ela não imite um site específico:
 * um mockup convincente demais seria lido como cliente real.
 */
export function MockupDuplo({ matiz, titulo }: Props) {
  const tela = {
    '--matiz': String(matiz),
  } as React.CSSProperties;

  return (
    <div className={s.raiz} style={tela} aria-hidden="true" data-mockup={titulo}>
      <div className={s.notebook} data-camada="fundo">
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

      <div className={s.celular} data-camada="frente">
        <div className={s.telaCelular}>
          <span className={s.notch} />
          <span className={s.heroFalsoMini} />
          <span className={s.linhaMini} />
          <span className={s.linhaMini} />
          <span className={s.botaoFalso} />
        </div>
      </div>
    </div>
  );
}
