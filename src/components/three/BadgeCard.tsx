'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

export const CARTAO = { largura: 1.36, altura: 2.02, espessura: 0.062 };

/**
 * Monograma "A" extrudado, sobreposto à face do crachá.
 *
 * Chevron com entalhe (silhueta do A sem furo) + travessão, os dois como
 * THREE.Shape. Extrudar geometria fina custa menos que carregar um normal
 * map e mantém a promessa do CLAUDE.md: nada de arquivo externo.
 */
function useGeometriaA(segmentos: number) {
  return useMemo(() => {
    const chevron = new THREE.Shape();
    chevron.moveTo(0, 0.5);
    chevron.lineTo(0.42, -0.5);
    chevron.lineTo(0.2, -0.5);
    chevron.lineTo(0, 0.16);
    chevron.lineTo(-0.2, -0.5);
    chevron.lineTo(-0.42, -0.5);
    chevron.closePath();

    const travessao = new THREE.Shape();
    travessao.moveTo(-0.235, -0.145);
    travessao.lineTo(0.235, -0.145);
    travessao.lineTo(0.235, -0.048);
    travessao.lineTo(-0.235, -0.048);
    travessao.closePath();

    const opcoes: THREE.ExtrudeGeometryOptions = {
      depth: 0.018,
      bevelEnabled: segmentos > 1,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: segmentos,
      curveSegments: segmentos,
    };

    const geo = new THREE.ExtrudeGeometry([chevron, travessao], opcoes);
    geo.center();
    return geo;
  }, [segmentos]);
}

export function BadgeCard({ mobile }: { mobile: boolean }) {
  const geoA = useGeometriaA(mobile ? 1 : 3);

  return (
    <group>
      {/* corpo — cartão arredondado, metalicidade contida, nunca espelhado */}
      <RoundedBox
        args={[CARTAO.largura, CARTAO.altura, CARTAO.espessura]}
        radius={0.072}
        smoothness={mobile ? 2 : 4}
        creaseAngle={0.5}
      >
        <meshPhysicalMaterial
          color="#131313"
          metalness={0.42}
          roughness={0.32}
          clearcoat={0.6}
          clearcoatRoughness={0.35}
          reflectivity={0.35}
        />
      </RoundedBox>

      {/* face útil, levemente mais clara, pra o "A" não flutuar no vazio */}
      <mesh position={[0, 0.12, CARTAO.espessura / 2 + 0.001]}>
        <planeGeometry args={[CARTAO.largura - 0.16, CARTAO.altura * 0.52]} />
        <meshPhysicalMaterial color="#1C1C1F" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* monograma em relevo — única cor de destaque da cena */}
      <mesh geometry={geoA} position={[0, 0.34, CARTAO.espessura / 2 + 0.004]} scale={0.56}>
        <meshPhysicalMaterial
          color="#F2790C"
          metalness={0.48}
          roughness={0.24}
          clearcoat={0.8}
          emissive="#B85600"
          emissiveIntensity={0.22}
        />
      </mesh>

      {/* filetes de dado — placeholder de nome/cargo, sem texto inventado */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.18 + i * 0.02, -0.42 - i * 0.13, CARTAO.espessura / 2 + 0.002]}>
          <planeGeometry args={[0.62 - i * 0.16, 0.026]} />
          <meshBasicMaterial color={i === 0 ? '#8A8A92' : '#3a3a42'} />
        </mesh>
      ))}

      {/* recorte do clipe, no topo */}
      <mesh position={[0, CARTAO.altura / 2 - 0.14, 0]}>
        <torusGeometry args={[0.062, 0.016, mobile ? 5 : 10, mobile ? 12 : 24]} />
        <meshPhysicalMaterial color="#4A4A52" metalness={0.85} roughness={0.28} />
      </mesh>
    </group>
  );
}
