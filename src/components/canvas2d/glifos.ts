/**
 * Glifos desenhados à mão pras ferramentas que ainda não têm SVG hospedado,
 * e fallback pras que têm caso o arquivo falhe.
 *
 * São representações geométricas simples e honestas, não são reproduções
 * exatas das marcas. [ASSET · SVGs oficiais de Next.js, TypeScript, Supabase,
 * n8n e Vercel, se a Atlas quiser fidelidade de marca no pote.]
 */

type Ctx = CanvasRenderingContext2D;

function texto(ctx: Ctx, conteudo: string, r: number, escala = 0.46) {
  ctx.font = `600 ${r * escala}px var(--font-body), system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(conteudo, 0, r * 0.03);
}

const DESENHOS: Record<string, (ctx: Ctx, r: number) => void> = {
  'Next.js': (ctx, r) => {
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.52, 0, Math.PI * 2);
    ctx.stroke();
    texto(ctx, 'N', r, 0.5);
  },

  TypeScript: (ctx, r) => {
    ctx.beginPath();
    ctx.roundRect(-r * 0.5, -r * 0.5, r, r, r * 0.14);
    ctx.stroke();
    texto(ctx, 'TS', r, 0.42);
  },

  Supabase: (ctx, r) => {
    // raio: dois triângulos espelhados
    ctx.beginPath();
    ctx.moveTo(r * 0.12, -r * 0.54);
    ctx.lineTo(-r * 0.42, r * 0.06);
    ctx.lineTo(-r * 0.02, r * 0.06);
    ctx.lineTo(-r * 0.12, r * 0.54);
    ctx.lineTo(r * 0.42, -r * 0.06);
    ctx.lineTo(r * 0.02, -r * 0.06);
    ctx.closePath();
    ctx.fill();
  },

  n8n: (ctx, r) => {
    // três nós ligados, a metáfora de fluxo de automação
    const nos: [number, number][] = [
      [-r * 0.46, 0],
      [0, -r * 0.3],
      [r * 0.46, r * 0.24],
    ];
    ctx.beginPath();
    ctx.moveTo(nos[0][0], nos[0][1]);
    ctx.lineTo(nos[1][0], nos[1][1]);
    ctx.lineTo(nos[2][0], nos[2][1]);
    ctx.stroke();
    nos.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, r * 0.14, 0, Math.PI * 2);
      ctx.fill();
    });
  },

  Vercel: (ctx, r) => {
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.46);
    ctx.lineTo(r * 0.56, r * 0.4);
    ctx.lineTo(-r * 0.56, r * 0.4);
    ctx.closePath();
    ctx.fill();
  },
};

export function desenharGlifo(ctx: Ctx, rotulo: string, x: number, y: number, r: number, claro: boolean) {
  ctx.save();
  ctx.translate(x, y);
  const tinta = claro ? '#0A0A0A' : '#F7F5EF';
  ctx.fillStyle = tinta;
  ctx.strokeStyle = tinta;
  ctx.lineWidth = Math.max(1.2, r * 0.09);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const desenho = DESENHOS[rotulo];
  if (desenho) desenho(ctx, r);
  else texto(ctx, rotulo.slice(0, 2), r);

  ctx.restore();
}
