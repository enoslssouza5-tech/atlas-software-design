'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { CARTAO } from './BadgeCard';

/**
 * Cordão. Curva CatmullRom levada a TubeGeometry.
 *
 * O vaivém NÃO recria a geometria a cada frame: quem oscila é o pivô lá em
 * cima (ver BadgeScene), o que dá o mesmo pêndulo por uma fração do custo.
 * Recriar um TubeGeometry 60 vezes por segundo é churn de GC puro, e o
 * CLAUDE.md já proíbe física real de corda pelo mesmo motivo.
 */
export function BadgeLanyard({ mobile }: { mobile: boolean }) {
  const geometria = useMemo(() => {
    const topo = CARTAO.altura / 2 - 0.14;

    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.46, topo + 2.35, -0.12),
      new THREE.Vector3(-0.34, topo + 1.62, 0.04),
      new THREE.Vector3(-0.16, topo + 0.86, 0.05),
      new THREE.Vector3(-0.03, topo + 0.28, 0.01),
      new THREE.Vector3(0, topo + 0.02, 0),
      new THREE.Vector3(0.03, topo + 0.28, -0.01),
      new THREE.Vector3(0.17, topo + 0.86, -0.05),
      new THREE.Vector3(0.35, topo + 1.62, -0.04),
      new THREE.Vector3(0.47, topo + 2.35, 0.12),
    ]);
    curva.curveType = 'centripetal';

    return new THREE.TubeGeometry(
      curva,
      mobile ? 40 : 96,
      0.026,
      mobile ? 4 : 8,
      false,
    );
  }, [mobile]);

  return (
    <mesh geometry={geometria}>
      <meshPhysicalMaterial
        color="#1f1f24"
        metalness={0.18}
        roughness={0.78}
        sheen={0.4}
        sheenColor="#F2790C"
      />
    </mesh>
  );
}
