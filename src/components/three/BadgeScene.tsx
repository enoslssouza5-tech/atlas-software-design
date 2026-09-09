'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { BadgeCard, CARTAO } from './BadgeCard';
import { BadgeLanyard } from './BadgeLanyard';
import { SceneLights } from './SceneLights';
import { sinal } from '@/lib/cena-signal';

/** teto de rotação por mouse: 10 graus. Passou disso vira brinquedo. */
const GIRO_MAX = THREE.MathUtils.degToRad(10);
const PIVO_Y = CARTAO.altura / 2 + 2.2;

type Props = { mobile: boolean; reduzido: boolean };

export function BadgeScene({ mobile, reduzido }: Props) {
  const grupo = useRef<THREE.Group>(null);
  const pendulo = useRef<THREE.Group>(null);
  const estado = useRef({ x: 0, y: 0, escala: 0.6, opacidade: 0, giroX: 0, giroY: 0 });

  // Sonda de desenvolvimento: sem isto, depurar "por que o crachá sumiu"
  // vira adivinhação, porque nada deste caminho passa por render do React.
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__atlasCena = {
      sinal,
      estado: estado.current,
    };
  }

  useFrame((_, delta) => {
    const g = grupo.current;
    const p = pendulo.current;
    if (!g) return;

    // clamp do delta: aba em segundo plano volta com delta gigante e o
    // objeto daria um salto na cara do usuário
    const dt = Math.min(delta, 1 / 30);
    const suavizar = 1 - Math.pow(0.0015, dt);
    const e = estado.current;
    const alvo = sinal.alvo;

    e.x += (alvo.x - e.x) * suavizar;
    e.y += (alvo.y - e.y) * suavizar;
    e.escala += (alvo.escala - e.escala) * suavizar;
    e.opacidade += (alvo.opacidade - e.opacidade) * suavizar;

    g.position.set(e.x, e.y, 0);
    g.scale.setScalar(e.escala);
    g.visible = e.opacidade > 0.01;

    // Em reduced motion a cena existe, está iluminada e posicionada —
    // só não se mexe. Continua visível, nunca some.
    if (reduzido) {
      g.rotation.set(0, alvo.giro, 0);
      if (p) p.rotation.z = 0;
      return;
    }

    const alvoY = alvo.giro + sinal.mouseX * GIRO_MAX;
    const alvoX = -sinal.mouseY * GIRO_MAX * 0.6;
    e.giroY += (alvoY - e.giroY) * suavizar;
    e.giroX += (alvoX - e.giroX) * suavizar;
    g.rotation.set(e.giroX, e.giroY, 0);

    // vaivém do cordão: oscilação senoidal no pivô, não na malha.
    // No mobile o pêndulo fica parado, conforme o CLAUDE.md.
    if (p && !mobile) {
      const t = performance.now() * 0.001;
      p.rotation.z = Math.sin(t * 0.62) * 0.036 + Math.sin(t * 1.37) * 0.012;
    }
  });

  return (
    <group ref={grupo} scale={0.6}>
      <SceneLights mobile={mobile} />
      {/* pivô do pêndulo fica acima da cena; o conjunto inteiro balança dele */}
      <group ref={pendulo} position={[0, PIVO_Y, 0]}>
        <group position={[0, -PIVO_Y, 0]}>
          <BadgeLanyard mobile={mobile} />
          <BadgeCard mobile={mobile} />
        </group>
      </group>
    </group>
  );
}
