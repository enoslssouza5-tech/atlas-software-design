'use client';

import { MarcaA } from '@/components/ui/MarcaA';
import s from './BadgeFallback.module.css';

/**
 * Substituto estático do crachá.
 *
 * Entra quando não há WebGL, quando a conexão é econômica, e enquanto o
 * bundle 3D ainda não chegou. É desenhado em CSS de propósito: uma imagem
 * seria mais um download justamente no cenário em que o download é o problema.
 *
 * [ASSET · opcionalmente trocar por um render estático em WebP do crachá final]
 */
export function BadgeFallback() {
  return (
    <div className={s.raiz} aria-hidden="true">
      <div className={s.cordao} />
      <div className={s.cartao}>
        <div className={s.clipe} />
        <MarcaA className={s.marca} />
        <div className={s.linhas}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
