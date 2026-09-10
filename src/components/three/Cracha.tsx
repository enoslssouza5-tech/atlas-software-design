'use client';

import dynamic from 'next/dynamic';
import { cena3dViavel, useDeviceTier } from '@/lib/use-device-tier';

/**
 * Porta de entrada da camada 3D.
 *
 * ssr:false e carregamento tardio são obrigatórios: o bundle do three chega
 * depois do first paint, nunca antes. Sem WebGL ou em conexão econômica o
 * Canvas simplesmente não é baixado, as seções mostram o crachá estático.
 */
const BadgeCanvas = dynamic(
  () => import('./BadgeCanvas').then((m) => m.BadgeCanvas),
  { ssr: false, loading: () => null },
);

export function Cracha() {
  const tier = useDeviceTier();
  if (!cena3dViavel(tier)) return null;
  return <BadgeCanvas />;
}

/** As seções perguntam isso pra saber se mostram o substituto estático. */
export function useCracha3d(): boolean {
  return cena3dViavel(useDeviceTier());
}
