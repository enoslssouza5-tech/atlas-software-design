// Crachá — fita (lanyard) com física verlet (vanilla), reutilizável p/ N crachás.
// Lógica idêntica ao protótipo aprovado: 14 pontos, verlet integration,
// constraint de distância fixa, 8 iterações por frame, arrasto independente.
//
// Dois detalhes que definem a leitura visual (não simplificar):
//  1. a corda é desenhada como FITA LARGA (LANYARD_WIDTH), com friso na cor
//     da marca e clipes metálicos nas duas pontas — uma linha fina lê como
//     barbante, não como crachá;
//  2. uma força horizontal senoidal contínua ("vento") mantém o crachá em
//     movimento sutil mesmo sem interação — nunca 100% estático.
export function initBadgeRope(wrapperEl, canvas, card){
  const ctx = canvas.getContext('2d');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H;
  function resize(){
    W = canvas.clientWidth || 220; H = wrapperEl.clientHeight;
    canvas.width = W; canvas.height = H;
  }
  resize();
  window.addEventListener('resize', resize);

  const NUM_POINTS=14, SEGMENT_LEN=15, GRAVITY=0.82, FRICTION=0.99, ITER=10;
  const LANYARD_WIDTH = 13; // fita larga, não fio fino
  const startTime = performance.now();
  const anchor = { x:()=>W/2, y:()=>30 };
  let points=[];
  function initRope(){
    points=[];
    for(let i=0;i<NUM_POINTS;i++){
      points.push({ x:anchor.x(), y:anchor.y()+i*SEGMENT_LEN, oldx:anchor.x(), oldy:anchor.y()+i*SEGMENT_LEN, pinned:i===0 });
    }
  }
  initRope();

  let dragging=false;
  const mouse={x:0,y:0,px:0,py:0};
  function getBadgePoint(){ return points[points.length-1]; }
  function localMouse(e){
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x:t.clientX-rect.left, y:t.clientY-rect.top };
  }
  function pointerDown(e){
    const m = localMouse(e); const b = getBadgePoint();
    const d = Math.hypot(m.x-b.x, m.y-(b.y+84));
    if(d<132){ dragging=true; mouse.x=m.x; mouse.y=m.y-84; mouse.px=mouse.x; mouse.py=mouse.y; }
  }
  function pointerMove(e){
    if(!dragging) return;
    const m = localMouse(e);
    mouse.px=mouse.x; mouse.py=mouse.y;
    mouse.x=m.x; mouse.y=m.y-84;
  }
  function pointerUp(){ dragging=false; }

  canvas.addEventListener('mousedown', pointerDown);
  canvas.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);
  canvas.addEventListener('touchstart', pointerDown, {passive:true});
  canvas.addEventListener('touchmove', pointerMove, {passive:true});
  window.addEventListener('touchend', pointerUp);
  card.addEventListener('mousedown', pointerDown);
  card.addEventListener('touchstart', pointerDown, {passive:true});

  function updatePoints(){
    // leve "vento" contínuo, pra nunca ficar 100% estático/reto
    const t = (performance.now() - startTime) * 0.001;
    const wind = reducedMotion ? 0 : Math.sin(t * 0.55) * 0.06 + Math.sin(t * 1.3 + 1) * 0.03;
    for(let i=0;i<points.length;i++){
      const p=points[i];
      if(p.pinned){ p.x=anchor.x(); p.y=anchor.y(); continue; }
      const isBadge = (i===points.length-1);
      if(isBadge && dragging){
        p.oldx = p.x-(mouse.x-mouse.px); p.oldy = p.y-(mouse.y-mouse.py);
        p.x=mouse.x; p.y=mouse.y; continue;
      }
      const massDamping = isBadge ? 0.965 : FRICTION;
      const vx=(p.x-p.oldx)*massDamping + wind*(i/points.length), vy=(p.y-p.oldy)*massDamping;
      p.oldx=p.x; p.oldy=p.y; p.x+=vx; p.y+=vy+GRAVITY;
    }
  }
  function applyConstraints(){
    for(let iter=0; iter<ITER; iter++){
      for(let i=0;i<points.length-1;i++){
        const a=points[i], b=points[i+1];
        const dx=b.x-a.x, dy=b.y-a.y;
        const dist=Math.hypot(dx,dy)||0.0001;
        const diff=(SEGMENT_LEN-dist)/dist;
        const offx=dx*diff*0.5, offy=dy*diff*0.5;
        if(!a.pinned){ a.x-=offx; a.y-=offy; }
        if(!b.pinned){ b.x+=offx; b.y+=offy; }
      }
      for(const p of points){
        if(p.x<10) p.x=10; if(p.x>W-10) p.x=W-10; if(p.y>H-40) p.y=H-40;
      }
    }
  }
  function drawRope(){
    ctx.clearRect(0,0,W,H);

    // ---- fita do crachá (lanyard largo, não fio) ----
    const left = [], right = [];
    for(let i=0;i<points.length;i++){
      const p = points[i];
      const next = points[Math.min(i+1, points.length-1)];
      const prev = points[Math.max(i-1, 0)];
      const dx = next.x - prev.x, dy = next.y - prev.y;
      const len = Math.hypot(dx,dy) || 0.0001;
      const nx = -dy/len, ny = dx/len; // normal perpendicular ao segmento
      left.push({ x:p.x + nx*LANYARD_WIDTH/2, y:p.y + ny*LANYARD_WIDTH/2 });
      right.push({ x:p.x - nx*LANYARD_WIDTH/2, y:p.y - ny*LANYARD_WIDTH/2 });
    }
    ctx.beginPath();
    ctx.moveTo(left[0].x, left[0].y);
    for(let i=1;i<left.length;i++) ctx.lineTo(left[i].x, left[i].y);
    for(let i=right.length-1;i>=0;i--) ctx.lineTo(right[i].x, right[i].y);
    ctx.closePath();
    // O protótipo preenchia a fita com cinza quase preto (#1c1c1c → #0d0d0d).
    // Sobre o fundo #0a0a0a isso desaparece e sobra só o friso central — ou
    // seja, volta a ler como fio fino. Clareamos o tecido e desenhamos as
    // bordas pra que a LARGURA da fita seja de fato visível.
    const lanyardGrad = ctx.createLinearGradient(0, anchor.y(), W, points[points.length-1].y);
    lanyardGrad.addColorStop(0, '#56555d');
    lanyardGrad.addColorStop(0.45, '#25252b');
    lanyardGrad.addColorStop(1, '#141418');
    ctx.fillStyle = lanyardGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; // costura das bordas
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(left[1].x, left[1].y);
    for(let i=2;i<left.length-1;i++) ctx.lineTo(left[i].x, left[i].y);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // friso de destaque no centro da fita, cor da marca
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for(let i=1;i<points.length;i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.strokeStyle = 'rgba(255,179,71,0.72)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // clipe metálico no topo (fixação)
    ctx.beginPath(); ctx.arc(anchor.x(),anchor.y(),7,0,Math.PI*2);
    const clipGrad = ctx.createLinearGradient(anchor.x()-7,0,anchor.x()+7,0);
    clipGrad.addColorStop(0,'#777'); clipGrad.addColorStop(0.34,'#f0f0f0'); clipGrad.addColorStop(0.62,'#9b9b9b'); clipGrad.addColorStop(1,'#525252');
    ctx.fillStyle = clipGrad; ctx.fill();

    // clipe metálico onde a fita encontra o crachá
    const b = points[points.length-1];
    ctx.beginPath();
    if(ctx.roundRect){ ctx.roundRect(b.x-15, b.y-7, 30, 14, 4); } else { ctx.rect(b.x-15, b.y-7, 30, 14); }
    ctx.fillStyle = clipGrad; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  function positionCard(){
    const b=getBadgePoint(); const prev=points[points.length-2];
    const angle=Math.atan2(b.y-prev.y, b.x-prev.x)-Math.PI/2;
    const cardX = b.x - 85;
    const cardY = b.y + 4;
    const swing=(b.x-prev.x)*2.2;
    const lift=(b.y-prev.y-SEGMENT_LEN)*0.5;
    card.style.transform = `translate(${cardX}px, ${cardY}px) perspective(760px) rotateZ(${angle}rad) rotateY(${Math.max(-20,Math.min(20,swing))}deg) rotateX(${Math.max(-8,Math.min(8,lift))}deg) translateZ(16px)`;
  }
  function loop(){ updatePoints(); applyConstraints(); drawRope(); positionCard(); requestAnimationFrame(loop); }
  loop();
}
