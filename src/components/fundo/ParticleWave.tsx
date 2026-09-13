'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDeviceTier } from '@/lib/use-device-tier';
import { criarFiltroResizeReal } from '@/lib/resize-real';
import s from './ParticleWave.module.css';

/**
 * Fundo fixo de partículas em Three.js vanilla (sem react-three-fiber),
 * atrás do conteúdo de toda seção fora do Hero, que continua com a
 * própria imagem de fundo. Sempre escuro, cor única: as seções `claro`
 * cobrem esse canvas com um fundo sólido próprio (ver `Ato.module.css`),
 * então a partícula nunca precisa mudar de cor.
 *
 * Portado do componente de referência do briefing, com dois cortes de
 * propósito:
 * - Sem detecção de tema (o site não tem alternância clara/escura por
 *   preferência do sistema).
 * - Sem rastreamento de mouse: o shader de partícula nunca leu a posição
 *   do ponteiro, o `mousemove` só existia sem efeito nenhum na animação.
 */

const CORES = {
  fundoEscuro: new THREE.Color('#0A0A0A'),
  particulaEscura: new THREE.Color('#F2790C'),
};

const VERTEX_PONTOS = `
  attribute float scale;
  uniform float uTime;
  void main() {
    vec3 p = position;
    float s = scale;
    p.y += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
    p.x += (sin(p.y + uTime) * 0.5);
    s += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_PONTOS = `
  uniform vec3 uCor;
  void main() {
    gl_FragColor = vec4(uCor, 0.5);
  }
`;

export function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = useDeviceTier();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tier.pronto || !tier.webgl) return;

    // Desktop, grade 200x200. Mobile, 80x80 como ponto de partida (pedido
    // explícito do briefing), reduz o número de partículas em ~84%.
    const quantidadeLado = tier.mobile ? 80 : 200;
    const espaco = 0.3;

    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, winWidth / winHeight, 0.01, 1000);
    camera.position.set(0, 6, 5);
    // sem isso a câmera olha na direção -Z padrão, na horizontal, e a grade
    // de partículas (que vive perto do plano XZ) fica quase toda fora do
    // enquadramento; mirar a origem é o que deixa a onda visível no quadro.
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !tier.mobile, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier.mobile ? 1.5 : 2));
    renderer.setSize(winWidth, winHeight);
    renderer.setClearColor(CORES.fundoEscuro);

    const numeroParticulas = quantidadeLado * quantidadeLado;
    const posicoes = new Float32Array(numeroParticulas * 3);
    const escalas = new Float32Array(numeroParticulas);

    let i = 0;
    let j = 0;
    for (let ix = 0; ix < quantidadeLado; ix++) {
      for (let iy = 0; iy < quantidadeLado; iy++) {
        posicoes[i] = ix * espaco - (quantidadeLado * espaco) / 2;
        posicoes[i + 1] = 0;
        posicoes[i + 2] = iy * espaco - (quantidadeLado * espaco) / 2;
        escalas[j] = 1;
        i += 3;
        j++;
      }
    }

    const geometria = new THREE.BufferGeometry();
    geometria.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
    geometria.setAttribute('scale', new THREE.BufferAttribute(escalas, 1));

    const materialPontos = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: VERTEX_PONTOS,
      fragmentShader: FRAGMENT_PONTOS,
      uniforms: {
        uTime: { value: 0 },
        uCor: { value: CORES.particulaEscura.clone() },
      },
    });

    const particulas = new THREE.Points(geometria, materialPontos);
    scene.add(particulas);

    let visivel = document.visibilityState === 'visible';
    const aoMudarVisibilidade = () => {
      visivel = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', aoMudarVisibilidade);

    let animId = 0;
    function animar() {
      animId = requestAnimationFrame(animar);
      if (!visivel) return;

      if (!tier.reduzido) {
        materialPontos.uniforms.uTime.value += 0.05;
      }

      renderer.render(scene, camera);
    }
    animar();

    // Mesmo filtro do Ato1Hero: no mobile, a barra de endereço recolhendo
    // dispara `resize` só de altura, e sem essa guarda o renderer inteiro
    // seria remedido a cada rolagem, à toa.
    const resizeReal = criarFiltroResizeReal(tier.mobile);
    const aoRedimensionar = () => {
      if (!resizeReal()) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', aoRedimensionar);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', aoRedimensionar);
      document.removeEventListener('visibilitychange', aoMudarVisibilidade);
      scene.remove(particulas);
      geometria.dispose();
      materialPontos.dispose();
      renderer.dispose();
    };
  }, [tier.pronto, tier.webgl, tier.mobile, tier.reduzido]);

  if (!tier.pronto || !tier.webgl) return null;

  return <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />;
}
