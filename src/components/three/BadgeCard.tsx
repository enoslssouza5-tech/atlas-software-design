'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

export const CARTAO = { largura: 1.36, altura: 2.02, espessura: 0.062 };

type Socio = { nome: string; setor: string };

/**
 * As duas faces do crachá. `setor` fica em placeholder visível enquanto o
 * cargo real de cada sócio não chega, igual a qualquer outro dado não
 * confirmado no site: nunca inventar, sempre marcar o que falta.
 */
const SOCIOS: { frente: Socio; verso: Socio } = {
  frente: { nome: 'Enos', setor: '[SETOR · confirmar cargo do Enos]' },
  verso: { nome: 'Lucas', setor: '[SETOR · confirmar cargo do Lucas]' },
};

const PAINEL = { largura: CARTAO.largura - 0.16, altura: 1.5 };
const TEXTURA = { largura: 480, altura: 600 };

function quebrarLinha(ctx: CanvasRenderingContext2D, texto: string, larguraMax: number) {
  const palavras = texto.split(' ');
  const linhas: string[] = [];
  let atual = '';
  palavras.forEach((palavra) => {
    const teste = atual ? `${atual} ${palavra}` : palavra;
    if (atual && ctx.measureText(teste).width > larguraMax) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = teste;
    }
  });
  if (atual) linhas.push(atual);
  return linhas;
}

/**
 * Desenha a identidade de um sócio num canvas 2D: marca A, avatar (inicial
 * do nome, enquanto não existe foto real pra virar textura), nome e setor.
 */
function desenharFace(ctx: CanvasRenderingContext2D, socio: Socio) {
  const { largura, altura } = TEXTURA;

  ctx.fillStyle = '#1C1C1F';
  ctx.fillRect(0, 0, largura, altura);

  // marca A, canto superior esquerdo, mesma cor de acento do site inteiro
  ctx.fillStyle = '#F2790C';
  ctx.beginPath();
  ctx.moveTo(largura * 0.1, altura * 0.145);
  ctx.lineTo(largura * 0.155, altura * 0.145);
  ctx.lineTo(largura * 0.1275, altura * 0.06);
  ctx.closePath();
  ctx.fill();

  // avatar: círculo com a inicial do nome, placeholder até existir foto real
  const cx = largura / 2;
  const cy = altura * 0.36;
  const raio = largura * 0.24;

  ctx.fillStyle = '#2A2A30';
  ctx.beginPath();
  ctx.arc(cx, cy, raio, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = largura * 0.012;
  ctx.strokeStyle = '#F2790C';
  ctx.stroke();

  ctx.fillStyle = '#F2790C';
  ctx.font = `700 ${Math.round(raio * 1.15)}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(socio.nome.charAt(0).toUpperCase(), cx, cy + raio * 0.04);

  // nome, dado real
  ctx.fillStyle = '#F7F5EF';
  ctx.font = `600 ${Math.round(largura * 0.085)}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(socio.nome, cx, altura * 0.665);

  // setor, placeholder enquanto o cargo real não é confirmado
  ctx.fillStyle = '#8A8A92';
  ctx.font = `500 ${Math.round(largura * 0.034)}px system-ui, -apple-system, sans-serif`;
  const linhas = quebrarLinha(ctx, socio.setor, largura * 0.84);
  linhas.forEach((linha, i) => {
    ctx.fillText(linha, cx, altura * 0.75 + i * largura * 0.048);
  });
}

function useTexturaFace(socio: Socio) {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = TEXTURA.largura;
    canvas.height = TEXTURA.altura;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    desenharFace(ctx, socio);
    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.needsUpdate = true;
    return textura;
  }, [socio]);
}

export function BadgeCard({ mobile }: { mobile: boolean }) {
  const texturaFrente = useTexturaFace(SOCIOS.frente);
  const texturaVerso = useTexturaFace(SOCIOS.verso);

  return (
    <group>
      {/* corpo: cartão arredondado, metalicidade contida, nunca espelhado */}
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

      {/* face da frente: foto e dados do Enos */}
      <mesh position={[0, -0.03, CARTAO.espessura / 2 + 0.001]}>
        <planeGeometry args={[PAINEL.largura, PAINEL.altura]} />
        <meshStandardMaterial
          map={texturaFrente ?? undefined}
          metalness={0.05}
          roughness={0.75}
          toneMapped={false}
        />
      </mesh>

      {/* face de trás: foto e dados do Lucas, girada 180 graus em Y pra não
          sair espelhada quando o crachá completa a meia volta */}
      <mesh position={[0, -0.03, -CARTAO.espessura / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[PAINEL.largura, PAINEL.altura]} />
        <meshStandardMaterial
          map={texturaVerso ?? undefined}
          metalness={0.05}
          roughness={0.75}
          toneMapped={false}
        />
      </mesh>

      {/* recorte do clipe, no topo */}
      <mesh position={[0, CARTAO.altura / 2 - 0.14, 0]}>
        <torusGeometry args={[0.062, 0.016, mobile ? 5 : 10, mobile ? 12 : 24]} />
        <meshPhysicalMaterial color="#4A4A52" metalness={0.85} roughness={0.28} />
      </mesh>
    </group>
  );
}
