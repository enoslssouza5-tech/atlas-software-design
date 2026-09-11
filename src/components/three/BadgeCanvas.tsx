'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { BadgeScene } from './BadgeScene';
import { aoMudarAtividade, sinal } from '@/lib/cena-signal';
import { useDeviceTier } from '@/lib/use-device-tier';
import s from './BadgeCanvas.module.css';

/**
 * O único Canvas do projeto.
 *
 * Fica fixo atrás do conteúdo, mas só aparece durante o Ato 1: o crachá é
 * estático ali, centralizado, e a única coisa que acompanha o scroll é o
 * giro de meia volta entre a face da frente e a de trás. Ele não viaja pro
 * resto da página.
 */
export function BadgeCanvas() {
  const tier = useDeviceTier();
  const [rodando, setRodando] = useState(true);
  const pausa = useRef<number | null>(null);

  // ponteiro: mousemove é permitido, o que não pode é listener de scroll
  useEffect(() => {
    if (tier.reduzido) return;

    const mover = (e: PointerEvent) => {
      sinal.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      sinal.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', mover, { passive: true });
    return () => window.removeEventListener('pointermove', mover);
  }, [tier.reduzido]);

  // frameloop desliga quando nenhum ato reivindica o crachá,
  // com folga pra a saída suave terminar antes
  useEffect(() => {
    return aoMudarAtividade((ativo) => {
      if (pausa.current) window.clearTimeout(pausa.current);
      if (ativo) {
        setRodando(true);
      } else {
        pausa.current = window.setTimeout(() => setRodando(false), 900);
      }
    });
  }, []);

  return (
    <div className={s.raiz} aria-hidden="true">
      <Canvas
        className={s.canvas}
        frameloop={rodando ? 'always' : 'never'}
        dpr={[1, tier.mobile ? 1.5 : 2]}
        // near/far apertado de propósito: com 0.1/40 (razão 400:1) o buffer
        // de profundidade perdia precisão bem onde importa, o cartão fino
        // (0.062 de espessura) girando perto de 180 graus, e a malha
        // colapsava visualmente pra quase nada. Tudo que a cena usa vive
        // entre ~5 e ~8 unidades da câmera; 3/12 sobra margem de boa.
        camera={{ position: [0, 0, 6.2], fov: 34, near: 3, far: 12 }}
        gl={{
          antialias: !tier.mobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <BadgeScene mobile={tier.mobile} reduzido={tier.reduzido} />
      </Canvas>
    </div>
  );
}
