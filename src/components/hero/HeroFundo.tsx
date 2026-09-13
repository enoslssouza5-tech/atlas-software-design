import s from './HeroFundo.module.css';

/**
 * Fundo de tela cheia do Ato 1, fora do <main> de propósito: nasce no mesmo
 * nível de empilhamento da seção do Hero, como irmã dela, com `position:
 * absolute` porque o fundo rola junto com o Hero.
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
    </div>
  );
}
