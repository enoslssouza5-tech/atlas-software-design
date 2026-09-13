'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDeviceTier } from '@/lib/use-device-tier';
import { useLenis } from '@/providers/LenisProvider';
import { idsSecaoClaraAtiva } from '@/lib/fundo-signal';
import s from './ParticleWave.module.css';

/**
 * Fundo fixo de partículas em Three.js vanilla (sem react-three-fiber),
 * atrás do conteúdo de toda seção fora do Hero, que continua com a
 * própria imagem de fundo.
 *
 * Portado do componente de referência do briefing, com três cortes de
 * propósito:
 * - Sem detecção de tema (o site não tem alternância clara/escura por
 *   preferência do sistema): a cor do fundo e da partícula vêm sempre
 *   daqui, e só clareiam quando uma seção `claro` está na tela (ver
 *   `src/lib/fundo-signal.ts`), nunca por `prefers-color-scheme`.
 * - Sem rastreamento de mouse: o shader de partícula nunca leu a posição
 *   do ponteiro, o `mousemove` só existia sem efeito nenhum na animação.
 * - `uTime` sobe sozinho em `requestAnimationFrame`, sem qualquer entrada
 *   de interação.
 *
 * O corte claro/escuro é físico, não uma cor média da tela inteira: cada
 * partícula (e cada pixel do fundo) decide a própria cor comparando a
 * própria posição de tela contra o retângulo real da seção clara ativa,
 * medido via `getBoundingClientRect`. Isso é o que deixa metade da tela
 * escura e metade clara no mesmo frame, durante a transição.
 */

const CORES = {
  fundoEscuro: new THREE.Color('#0A0A0A'),
  fundoClaro: new THREE.Color('#F7F5EF'),
  particulaEscura: new THREE.Color('#F2790C'),
  particulaClara: new THREE.Color('#B85600'),
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

// `gl_FragCoord.y` já vem em pixels físicos do framebuffer, origem embaixo
// (ao contrário do topo, que é a origem de `getBoundingClientRect`). Os
// uniforms `uClaroInicio`/`uClaroFim` chegam já convertidos pra esse mesmo
// referencial (ver `medirRecorte` no componente). `step()`, não `smoothstep`
// nem mistura por distância: o corte é de um pixel pro outro, sem degradê.
const RECORTE_COMUM = `
  uniform float uClaroInicio;
  uniform float uClaroFim;
  uniform float uAtivo;

  float dentroDoRecorte() {
    return uAtivo * step(uClaroInicio, gl_FragCoord.y) * step(gl_FragCoord.y, uClaroFim);
  }
`;

const FRAGMENT_PONTOS = `
  uniform vec3 uCorEscura;
  uniform vec3 uCorClara;
  ${RECORTE_COMUM}
  void main() {
    vec3 cor = mix(uCorEscura, uCorClara, dentroDoRecorte());
    gl_FragColor = vec4(cor, 0.5);
  }
`;

const VERTEX_FUNDO = `
  void main() {
    // Quad de dois triângulos cobrindo a tela inteira: a posição já chega
    // em coordenadas de clip-space (-1 a 1), sem passar pela câmera da
    // cena. É só um retângulo fixo colado no plano de fundo.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_FUNDO = `
  uniform vec3 uCorEscura;
  uniform vec3 uCorClara;
  ${RECORTE_COMUM}
  void main() {
    gl_FragColor = vec4(mix(uCorEscura, uCorClara, dentroDoRecorte()), 1.0);
  }
`;

export function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = useDeviceTier();
  const { lenis } = useLenis();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tier.pronto || !tier.webgl || !lenis) return;

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

    // Uniforms de recorte compartilhados por valor (não por referência de
    // objeto) entre o material dos pontos e o do fundo: cada um tem sua
    // própria cópia, atualizada junto em `medirRecorte`.
    const recorteInicial = { uClaroInicio: 0, uClaroFim: 0, uAtivo: 0 };

    const materialPontos = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: VERTEX_PONTOS,
      fragmentShader: FRAGMENT_PONTOS,
      uniforms: {
        uTime: { value: 0 },
        uCorEscura: { value: CORES.particulaEscura.clone() },
        uCorClara: { value: CORES.particulaClara.clone() },
        uClaroInicio: { value: recorteInicial.uClaroInicio },
        uClaroFim: { value: recorteInicial.uClaroFim },
        uAtivo: { value: recorteInicial.uAtivo },
      },
    });

    const particulas = new THREE.Points(geometria, materialPontos);
    scene.add(particulas);

    // Plano de fundo full screen: um WebGLRenderer só tem uma clear color
    // por frame, e ela pinta a tela inteira de uma vez. Pra ter metade
    // escura e metade clara ao mesmo tempo, o "fundo" vira geometria de
    // verdade, desenhada atrás de tudo, com o mesmo corte por pixel que as
    // partículas usam.
    const materialFundo = new THREE.ShaderMaterial({
      vertexShader: VERTEX_FUNDO,
      fragmentShader: FRAGMENT_FUNDO,
      uniforms: {
        uCorEscura: { value: CORES.fundoEscuro.clone() },
        uCorClara: { value: CORES.fundoClaro.clone() },
        uClaroInicio: { value: recorteInicial.uClaroInicio },
        uClaroFim: { value: recorteInicial.uClaroFim },
        uAtivo: { value: recorteInicial.uAtivo },
      },
      depthTest: false,
      depthWrite: false,
    });
    const fundo = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), materialFundo);
    fundo.frustumCulled = false;
    fundo.renderOrder = -1;
    scene.add(fundo);

    // Mede a seção clara ativa (se houver) e converte o retângulo pra
    // coordenadas de framebuffer (origem embaixo, pixels físicos, ver
    // `RECORTE_COMUM`). Chamada no mount e a cada evento de scroll do
    // Lenis, nunca a cada frame de RAF: a página só precisa saber onde a
    // seção está quando ela de fato se move.
    const medirRecorte = () => {
      const ids = idsSecaoClaraAtiva();
      let domTopo = Infinity;
      let domBase = -Infinity;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        domTopo = Math.min(domTopo, r.top);
        domBase = Math.max(domBase, r.bottom);
      }

      const ativo = Number.isFinite(domTopo) && Number.isFinite(domBase) ? 1 : 0;
      const dpr = renderer.getPixelRatio();
      const alturaFisica = window.innerHeight * dpr;
      const claroInicio = ativo ? alturaFisica - domBase * dpr : 0;
      const claroFim = ativo ? alturaFisica - domTopo * dpr : 0;

      for (const mat of [materialPontos, materialFundo]) {
        mat.uniforms.uAtivo.value = ativo;
        mat.uniforms.uClaroInicio.value = claroInicio;
        mat.uniforms.uClaroFim.value = claroFim;
      }
    };
    medirRecorte();
    lenis.on('scroll', medirRecorte);

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

    const aoRedimensionar = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      // A altura física e o `devicePixelRatio` mudam com a janela; sem
      // remedir aqui, o recorte ficaria com a escala antiga até o próximo
      // scroll.
      medirRecorte();
    };
    window.addEventListener('resize', aoRedimensionar);

    return () => {
      cancelAnimationFrame(animId);
      lenis.off('scroll', medirRecorte);
      window.removeEventListener('resize', aoRedimensionar);
      document.removeEventListener('visibilitychange', aoMudarVisibilidade);
      scene.remove(particulas);
      scene.remove(fundo);
      geometria.dispose();
      materialPontos.dispose();
      fundo.geometry.dispose();
      materialFundo.dispose();
      renderer.dispose();
    };
  }, [tier.pronto, tier.webgl, tier.mobile, tier.reduzido, lenis]);

  if (!tier.pronto || !tier.webgl) return null;

  return <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />;
}
