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
export function HeroFundo() {
  return (
    <div className={s.raiz} aria-hidden="true">
      <picture>
        <source srcSet="/hero-background.webp" type="image/webp" />
        <img src="/hero-background.jpg" alt="" className={s.imagem} />
      </picture>
      <div className={s.overlay} />
    </div>
  );
}
