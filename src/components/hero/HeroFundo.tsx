import s from './HeroFundo.module.css';

/**
 * Fundo de tela cheia do Ato 1, fora do <main> de propósito.
 *
 * A cena 3D do crachá é um Canvas fixo em z-index 1, e a seção do Hero vive
 * em z-index 2: para a imagem ficar atrás do crachá (não só atrás do texto),
 * ela precisa nascer no mesmo nível de empilhamento do Canvas, como irmã
 * dele, nunca como filha da seção. `position: absolute` porque o fundo rola
 * junto com o Hero; quem é fixo na tela é só o crachá.
 */
/* Abaixo de 768px a foto é outra, enquadrada em pé pro celular, não um
   recorte da mesma foto de paisagem do desktop. */
const QUEBRA_MOBILE = '(max-width: 767px)';

export function HeroFundo() {
  return (
    <div className={s.raiz} aria-hidden="true">
      <picture>
        <source media={QUEBRA_MOBILE} srcSet="/hero-background-mobile.webp" type="image/webp" />
        <source media={QUEBRA_MOBILE} srcSet="/hero-background-mobile.jpg" />
        <source srcSet="/hero-background.webp" type="image/webp" />
        <img src="/hero-background.jpg" alt="" className={s.imagem} />
      </picture>
      <div className={s.overlay} />
    </div>
  );
}
