/**
 * Pote de bolinhas do Ato 7: Canvas 2D puro.
 *
 * Zero dependências: nem GSAP, nem three, nem lib de física. Só a Canvas API.
 * A física (colisão círculo-círculo com impulso, parede circular, resolução
 * iterativa, arraste com velocidade herdada) vem do protótipo aprovado em
 * _legacy/js/ball-pit.js. O que mudou na porta está anotado abaixo.
 */

import { desenharGlifo } from './glifos';
import type { Ferramenta } from './ferramentas';

type Bolinha = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  cor: string;
  rotulo: string;
  claro: boolean;
  icone: HTMLImageElement | null;
  arrastando: boolean;
};

type Opcoes = {
  ferramentas: Ferramenta[];
  reduzido: boolean;
};

export type Pote = {
  /** -1 a 1, desloca o brilho do vidro conforme a seção cruza a viewport */
  definirLuz: (v: number) => void;
  destruir: () => void;
};

/** Passo fixo de simulação. Desacopla a física do refresh rate da tela. */
const PASSO = 1 / 60;
const GRAVIDADE = 0.42;
const RESTITUICAO = 0.58;
const AR = 0.995;
const ITERACOES = 3;
/** teto de passos por frame: evita espiral da morte depois de uma aba parada */
const MAX_PASSOS = 4;

function carregarIcone(caminho: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = caminho;
  });
}

export function criarPote(
  canvas: HTMLCanvasElement,
  secao: HTMLElement,
  { ferramentas, reduzido }: Opcoes,
): Pote {
  const contexto = canvas.getContext('2d');
  if (!contexto) return { definirLuz: () => {}, destruir: () => {} };
  // TypeScript não propaga a checagem acima pra dentro de function declarations
  // (elas são içadas), então o tipo já sai não-nulo daqui.
  const ctx: CanvasRenderingContext2D = contexto;

  let L = 0;
  let A = 0;
  let cx = 0;
  let cy = 0;
  let R = 0;
  let raioBolinha = 0;
  let luz = 0;
  let visivel = false;
  let rafId = 0;
  let ultimo = 0;
  let acumulado = 0;
  let destruido = false;

  const bolinhas: Bolinha[] = [];

  // ---------------------------------------------------------------
  // dimensionamento: devicePixelRatio de verdade.
  // O protótipo antigo usava canvas.width = clientWidth, o que deixava
  // tudo borrado em qualquer tela retina.
  // ---------------------------------------------------------------
  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const caixa = canvas.getBoundingClientRect();
    if (caixa.width === 0 || caixa.height === 0) return;

    L = caixa.width;
    A = caixa.height;
    canvas.width = Math.round(L * dpr);
    canvas.height = Math.round(A * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cx = L / 2;
    cy = A / 2;
    R = Math.min(L, A) * 0.44;

    // raio proporcional ao pote, nunca px fixo: em 360px de largura o raio
    // fixo de 36px do protótipo entupia o pote e as bolinhas mal se mexiam
    const anterior = raioBolinha;
    raioBolinha = Math.max(15, R / (ferramentas.length > 9 ? 4.7 : 4));

    if (anterior > 0) {
      const fator = raioBolinha / anterior;
      for (const b of bolinhas) {
        b.r = raioBolinha;
        b.x = cx + (b.x - cx) * fator;
        b.y = cy + (b.y - cy) * fator;
      }
    }
  }

  function povoar() {
    ferramentas.forEach((f, i) => {
      const angulo = (i / ferramentas.length) * Math.PI * 2;
      const dist = R * 0.34 * (0.45 + ((i * 7) % 5) / 7);
      bolinhas.push({
        x: cx + Math.cos(angulo) * dist,
        y: cy + Math.sin(angulo) * dist - R * 0.45,
        vx: Math.cos(angulo) * 1.3,
        vy: 0,
        r: raioBolinha,
        cor: f.cor,
        rotulo: f.rotulo,
        claro: Boolean(f.claro),
        icone: null,
        arrastando: false,
      });
    });
  }

  // ---------------------------------------------------------------
  // física
  // ---------------------------------------------------------------
  function integrar() {
    for (const b of bolinhas) {
      if (b.arrastando) continue;
      b.vy += GRAVIDADE;
      b.vx *= AR;
      b.vy *= AR;
      b.x += b.vx;
      b.y += b.vy;

      const dx = b.x - cx;
      const dy = b.y - cy;
      const dist = Math.hypot(dx, dy) || 0.0001;
      if (dist + b.r > R) {
        const nx = dx / dist;
        const ny = dy / dist;
        b.x = cx + nx * (R - b.r);
        b.y = cy + ny * (R - b.r);
        const vn = b.vx * nx + b.vy * ny;
        if (vn > 0) {
          b.vx -= (1 + RESTITUICAO) * vn * nx;
          b.vy -= (1 + RESTITUICAO) * vn * ny;
        }
      }
    }
  }

  function resolver() {
    for (let it = 0; it < ITERACOES; it++) {
      for (let i = 0; i < bolinhas.length; i++) {
        for (let j = i + 1; j < bolinhas.length; j++) {
          const a = bolinhas[i];
          const b = bolinhas[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const minima = a.r + b.r;
          if (dist >= minima) continue;

          const nx = dx / dist;
          const ny = dy / dist;
          const sobra = (minima - dist) / 2;
          if (!a.arrastando) {
            a.x -= nx * sobra;
            a.y -= ny * sobra;
          }
          if (!b.arrastando) {
            b.x += nx * sobra;
            b.y += ny * sobra;
          }

          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rel < 0) {
            const impulso = (-(1 + RESTITUICAO) * rel) / 2;
            if (!a.arrastando) {
              a.vx -= impulso * nx;
              a.vy -= impulso * ny;
            }
            if (!b.arrastando) {
              b.vx += impulso * nx;
              b.vy += impulso * ny;
            }
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------
  // desenho
  // ---------------------------------------------------------------
  function desenharPote() {
    // sombra de apoio por gradiente radial. O protótipo usava
    // ctx.filter = 'blur()', que falha silenciosamente em Safari antigo,
    // e a sombra simplesmente sumia sem ninguém perceber.
    const sombra = ctx.createRadialGradient(
      cx,
      cy + R * 0.94,
      R * 0.05,
      cx,
      cy + R * 0.94,
      R * 0.8,
    );
    sombra.addColorStop(0, 'rgba(0,0,0,0.5)');
    sombra.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sombra;
    ctx.beginPath();
    ctx.ellipse(cx, cy + R * 0.94, R * 0.85, R * 0.17, 0, 0, Math.PI * 2);
    ctx.fill();

    // vidro
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    const vidro = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
    vidro.addColorStop(0, 'rgba(255,255,255,0.10)');
    vidro.addColorStop(0.48, 'rgba(255,163,71,0.028)');
    vidro.addColorStop(1, 'rgba(255,255,255,0.012)');
    ctx.fillStyle = vidro;
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(247,245,239,0.2)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, R - 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(242,121,12,0.1)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // reflexos guiados pelo scroll. O valor chega do ScrollTrigger, nunca de
    // um listener de scroll próprio: com Lenis ativo isso seria um segundo
    // sistema de scroll lendo a página.
    ctx.beginPath();
    ctx.arc(cx + luz * R * 0.18, cy - luz * R * 0.08, R - 5, Math.PI * 1.15, Math.PI * 1.55);
    ctx.strokeStyle = 'rgba(247,245,239,0.44)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + luz * R * 0.24, cy - luz * R * 0.12, R - 16, Math.PI * 1.82, Math.PI * 2.1);
    ctx.strokeStyle = 'rgba(247,245,239,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function desenharBolinha(b: Bolinha) {
    // sombra de contato, mais forte quanto mais fundo no pote
    const profundidade = Math.max(0, Math.min(1, (b.y - cy) / R));
    ctx.beginPath();
    ctx.ellipse(b.x, b.y + b.r * 0.8, b.r * 0.74, b.r * 0.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,' + (0.05 + profundidade * 0.2).toFixed(3) + ')';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = b.cor;
    ctx.fill();

    const volume = ctx.createRadialGradient(
      b.x - b.r * 0.35,
      b.y - b.r * 0.35,
      b.r * 0.1,
      b.x,
      b.y,
      b.r,
    );
    volume.addColorStop(0, 'rgba(255,255,255,0.6)');
    volume.addColorStop(0.34, 'rgba(255,255,255,0.06)');
    volume.addColorStop(1, 'rgba(0,0,0,0.34)');
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = volume;
    ctx.fill();

    if (b.icone) {
      const s = b.r * 1.05;
      ctx.drawImage(b.icone, b.x - s / 2, b.y - s / 2, s, s);
    } else {
      desenharGlifo(ctx, b.rotulo, b.x, b.y, b.r, b.claro);
    }
  }

  function desenhar() {
    ctx.clearRect(0, 0, L, A);
    desenharPote();
    for (const b of bolinhas) desenharBolinha(b);
  }

  // ---------------------------------------------------------------
  // loop com passo fixo e teto de 60fps
  // ---------------------------------------------------------------
  function frame(agora: number) {
    if (destruido) return;
    rafId = requestAnimationFrame(frame);

    // fora da viewport o loop não simula nem pinta nada
    if (!visivel) {
      ultimo = agora;
      return;
    }

    const dt = (agora - ultimo) / 1000;
    ultimo = agora;
    acumulado = Math.min(acumulado + dt, PASSO * MAX_PASSOS);

    let passos = 0;
    while (acumulado >= PASSO && passos < MAX_PASSOS) {
      integrar();
      resolver();
      acumulado -= PASSO;
      passos += 1;
    }

    if (passos > 0) desenhar();
  }

  // ---------------------------------------------------------------
  // ponteiro
  // ---------------------------------------------------------------
  const ponteiro = { x: 0, y: 0, px: 0, py: 0 };
  let arrastado: Bolinha | null = null;

  function local(e: PointerEvent) {
    const caixa = canvas.getBoundingClientRect();
    return { x: e.clientX - caixa.left, y: e.clientY - caixa.top };
  }

  function aoPressionar(e: PointerEvent) {
    const m = local(e);
    let perto: Bolinha | null = null;
    let menor = Infinity;
    for (const b of bolinhas) {
      const d = Math.hypot(m.x - b.x, m.y - b.y);
      if (d < b.r * 1.35 && d < menor) {
        perto = b;
        menor = d;
      }
    }
    if (!perto) return;
    arrastado = perto;
    perto.arrastando = true;
    ponteiro.x = m.x;
    ponteiro.px = m.x;
    ponteiro.y = m.y;
    ponteiro.py = m.y;
    canvas.setPointerCapture(e.pointerId);
  }

  function aoMover(e: PointerEvent) {
    if (!arrastado) return;
    const m = local(e);
    ponteiro.px = ponteiro.x;
    ponteiro.py = ponteiro.y;
    ponteiro.x = m.x;
    ponteiro.y = m.y;
    arrastado.x = m.x;
    arrastado.y = m.y;
  }

  function aoSoltar() {
    if (!arrastado) return;
    arrastado.vx = (ponteiro.x - ponteiro.px) * 0.8;
    arrastado.vy = (ponteiro.y - ponteiro.py) * 0.8;
    arrastado.arrastando = false;
    arrastado = null;
  }

  // ---------------------------------------------------------------
  // ciclo de vida
  // ---------------------------------------------------------------
  redimensionar();
  povoar();

  void Promise.all(
    ferramentas.map((f) => (f.icone ? carregarIcone(f.icone) : Promise.resolve(null))),
  ).then((icones) => {
    if (destruido) return;
    icones.forEach((img, i) => {
      const b = bolinhas[i];
      if (b) b.icone = img;
    });
    desenhar();
  });

  const observador = new IntersectionObserver(
    (entradas) => {
      visivel = entradas[0].isIntersecting;
      if (visivel) ultimo = performance.now();
    },
    { threshold: 0.05 },
  );
  observador.observe(secao);

  const aoRedimensionar = () => {
    redimensionar();
    desenhar();
  };
  window.addEventListener('resize', aoRedimensionar, { passive: true });

  if (reduzido) {
    // Menos movimento: a física roda de uma vez, sem loop e sem rAF, e o
    // pote é desenhado já assentado. Continua visível, só não anima.
    for (let i = 0; i < 420; i += 1) {
      integrar();
      resolver();
    }
    for (const b of bolinhas) {
      b.vx = 0;
      b.vy = 0;
    }
    desenhar();
  } else {
    canvas.addEventListener('pointerdown', aoPressionar);
    canvas.addEventListener('pointermove', aoMover, { passive: true });
    canvas.addEventListener('pointerup', aoSoltar);
    canvas.addEventListener('pointercancel', aoSoltar);
    ultimo = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  return {
    definirLuz: (v: number) => {
      luz = v;
    },
    destruir: () => {
      destruido = true;
      cancelAnimationFrame(rafId);
      observador.disconnect();
      window.removeEventListener('resize', aoRedimensionar);
      canvas.removeEventListener('pointerdown', aoPressionar);
      canvas.removeEventListener('pointermove', aoMover);
      canvas.removeEventListener('pointerup', aoSoltar);
      canvas.removeEventListener('pointercancel', aoSoltar);
    },
  };
}
