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
 * Fica fixo atrás do conteúdo e atravessa a página inteira: é o mesmo crachá
 * que abre o Ato 1, reaparece de miniatura no Ato 3 e volta ao centro no
 * Ato 9. Um Canvas por ato multiplicaria contextos WebGL sem necessidade.
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
        camera={{ position: [0, 0, 6.2], fov: 34, near: 0.1, far: 40 }}
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
