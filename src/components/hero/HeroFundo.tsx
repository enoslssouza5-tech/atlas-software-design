import s from './HeroFundo.module.css';

/**
 * Fundo de tela cheia do Ato 1, fora do <main> de propósito: nasce no mesmo
 * nível de empilhamento da seção do Hero, como irmã dela, com `position:
 * absolute` porque o fundo rola junto com o Hero.
 */
export function HeroFundo() {
  return (
    <div className={s.raiz} aria-hidden="true">
      <picture className={s.picture}>
        <source media="(max-width: 767px)" srcSet="/NOVA%20MOBILE.png" />
        <img src="/NOVA.jpg" alt="" className={s.imagem} />
      </picture>
    </div>
  );
}
