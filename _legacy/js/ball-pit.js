// Bolinhas — física própria (gravidade, atrito, colisão elástica
// círculo-círculo, colisão com parede circular do pote), idêntica ao
// protótipo aprovado. Ganho de produção: ícones reais das ferramentas
// (SVG auto-hospedado via drawImage) com fallback pro ícone desenhado
// à mão caso algum download falhe, e sombra de contato pra profundidade.
import { loadToolIcons } from './icon-loader.js';

export const TOOLS = [
  { label:'GSAP',  color:'#88ce02', iconPath:'assets/icons/gsap.svg',       iconColor:'#ffffff' },
  { label:'JS',    color:'#f0db4f', iconPath:'assets/icons/javascript.svg', iconColor:'#0a0a0a' },
  { label:'CSS3',  color:'#2965f1', iconPath:'assets/icons/css3.svg',       iconColor:'#ffffff' },
  { label:'React', color:'#61dafb', iconPath:'assets/icons/react.svg',      iconColor:'#0a0a0a' },
  { label:'Git',   color:'#f34f29', iconPath:'assets/icons/git.svg',        iconColor:'#ffffff' },
  { label:'Figma', color:'#a259ff', iconPath:'assets/icons/figma.svg',      iconColor:'#ffffff' },
  { label:'HTML',  color:'#e34c26', iconPath:'assets/icons/html5.svg',      iconColor:'#ffffff' },
  { label:'Node',  color:'#3c873a', iconPath:'assets/icons/nodedotjs.svg',  iconColor:'#ffffff' },
];

const DARK_ICON = new Set(['JS','React']);

let iconMapPromise = null;
export function preloadBallIcons(){
  if (!iconMapPromise) iconMapPromise = loadToolIcons(TOOLS);
  return iconMapPromise;
}

// Fallback: ícone desenhado à mão em canvas (mesma lógica do protótipo),
// usado apenas se o SVG real daquele item não carregar.
function drawIconFallback(ctx, label, x, y, r){
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = DARK_ICON.has(label) ? '#0a0a0a' : '#ffffff';
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = r*0.08;
  switch(label){
    case 'JS':
      ctx.font = `bold ${r*0.62}px -apple-system, sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('JS', 0, r*0.04);
      break;
    case 'React':
      for(let i=0;i<3;i++){
        ctx.save(); ctx.rotate(i*Math.PI/3);
        ctx.beginPath(); ctx.ellipse(0,0, r*0.62, r*0.24, 0, 0, Math.PI*2); ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(0,0, r*0.13, 0, Math.PI*2); ctx.fill();
      break;
    case 'Git':
      ctx.beginPath(); ctx.moveTo(0,-r*0.5); ctx.lineTo(0,r*0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-r*0.1); ctx.lineTo(r*0.32,-r*0.35); ctx.stroke();
      [[0,-r*0.5],[0,r*0.5],[r*0.32,-r*0.35]].forEach(p=>{
        ctx.beginPath(); ctx.arc(p[0],p[1], r*0.12, 0, Math.PI*2); ctx.fill();
      });
      break;
    case 'Figma':
      ctx.beginPath(); ctx.arc(r*0.02,-r*0.28, r*0.2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(-r*0.2, r*0.05, r*0.2, Math.PI*0.5, Math.PI*1.5); ctx.fill();
      ctx.beginPath();
      if(ctx.roundRect){ ctx.roundRect(-r*0.02, -r*0.15, r*0.4, r*0.4, r*0.08); } else { ctx.rect(-r*0.02,-r*0.15,r*0.4,r*0.4); }
      ctx.fill();
      break;
    case 'HTML':
      ctx.beginPath();
      ctx.moveTo(-r*0.34,-r*0.42); ctx.lineTo(r*0.34,-r*0.42); ctx.lineTo(r*0.24,r*0.42); ctx.lineTo(0,r*0.52); ctx.lineTo(-r*0.24,r*0.42); ctx.closePath();
      ctx.stroke();
      ctx.font = `bold ${r*0.4}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('5', 0, r*0.02);
      break;
    case 'CSS3':
      ctx.beginPath();
      ctx.moveTo(-r*0.34,-r*0.42); ctx.lineTo(r*0.34,-r*0.42); ctx.lineTo(r*0.24,r*0.42); ctx.lineTo(0,r*0.52); ctx.lineTo(-r*0.24,r*0.42); ctx.closePath();
      ctx.stroke();
      ctx.font = `bold ${r*0.4}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('3', 0, r*0.02);
      break;
    case 'Node':
      ctx.beginPath();
      for(let i=0;i<6;i++){
        const a = Math.PI/3*i - Math.PI/6;
        const px = Math.cos(a)*r*0.5, py = Math.sin(a)*r*0.5;
        i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
      }
      ctx.closePath(); ctx.stroke();
      ctx.font = `bold ${r*0.45}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('n', 0, r*0.06);
      break;
    case 'GSAP':
      ctx.beginPath(); ctx.arc(0,0,r*0.4, Math.PI*0.15, Math.PI*1.7); ctx.stroke();
      ctx.save(); ctx.rotate(Math.PI*1.7); ctx.translate(r*0.4,0);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-r*0.14,-r*0.1); ctx.lineTo(-r*0.14,r*0.1); ctx.closePath(); ctx.fill();
      ctx.restore();
      break;
    default:
      ctx.font = `bold ${r*0.4}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(label.slice(0,2), 0, r*0.04);
  }
  ctx.restore();
}

export async function initBallPit(section, canvas){
  const iconMap = await preloadBallIcons();
  const ctx = canvas.getContext('2d');
  let W,H,cx,cy,R;
  let glassLight = 0;
  function resize(){
    W=section.clientWidth; H=section.clientHeight; canvas.width=W; canvas.height=H;
    cx = W/2; cy = H/2 + 10;
    R = Math.min(W, H) * 0.42;
  }
  resize(); window.addEventListener('resize', resize);
  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    glassLight = Math.max(-1, Math.min(1, (window.innerHeight * .5 - rect.top) / Math.max(rect.height, 1) - .5));
  }, { passive:true });

  const GRAVITY=0.45, REST=0.6, AIR=0.995, ITER=3;
  let balls=[];
  function build(){
    balls = TOOLS.map((t,i)=>{
      const angle = Math.random()*Math.PI*2;
      const dist = Math.random()*R*0.4;
      return { x:cx+Math.cos(angle)*dist, y:cy+Math.sin(angle)*dist - 60 - i*30,
        vx:(Math.random()-0.5)*2, vy:0, r:36, color:t.color, label:t.label, dragging:false };
    });
  }
  build();

  const mouse={x:0,y:0,px:0,py:0}; let dragTarget=null;
  function localMouse(e){ const r=canvas.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return {x:t.clientX-r.left, y:t.clientY-r.top}; }
  function down(e){
    const m=localMouse(e); let closest=null, cd=Infinity;
    for(const b of balls){ const d=Math.hypot(m.x-b.x,m.y-b.y); if(d<b.r*1.4 && d<cd){ closest=b; cd=d; } }
    if(closest){ dragTarget=closest; dragTarget.dragging=true; mouse.x=m.x; mouse.y=m.y; mouse.px=m.x; mouse.py=m.y; }
  }
  function move(e){ const m=localMouse(e); mouse.px=mouse.x; mouse.py=mouse.y; mouse.x=m.x; mouse.y=m.y; }
  function up(){ if(dragTarget){ dragTarget.vx=(mouse.x-mouse.px)*0.8; dragTarget.vy=(mouse.y-mouse.py)*0.8; dragTarget.dragging=false; dragTarget=null; } }
  canvas.addEventListener('mousedown', down);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);
  canvas.addEventListener('touchstart', down, {passive:true});
  window.addEventListener('touchmove', move, {passive:true});
  window.addEventListener('touchend', up);

  function integrate(){
    for(const b of balls){
      if(b.dragging){ b.x=mouse.x; b.y=mouse.y; b.vx=0; b.vy=0; continue; }
      b.vy+=GRAVITY; b.vx*=AIR; b.vy*=AIR; b.x+=b.vx; b.y+=b.vy;

      const dx=b.x-cx, dy=b.y-cy, dist=Math.hypot(dx,dy)||0.0001;
      if(dist + b.r > R){
        const nx=dx/dist, ny=dy/dist;
        b.x = cx + nx*(R-b.r); b.y = cy + ny*(R-b.r);
        const vDotN = b.vx*nx + b.vy*ny;
        if(vDotN > 0){ b.vx -= (1+REST)*vDotN*nx; b.vy -= (1+REST)*vDotN*ny; }
      }
    }
  }
  function resolve(){
    for(let it=0; it<ITER; it++){
      for(let i=0;i<balls.length;i++) for(let j=i+1;j<balls.length;j++){
        const a=balls[i], b=balls[j];
        const dx=b.x-a.x, dy=b.y-a.y, dist=Math.hypot(dx,dy)||0.0001, minD=a.r+b.r;
        if(dist<minD){
          const nx=dx/dist, ny=dy/dist, overlap=minD-dist;
          if(!a.dragging){ a.x-=nx*overlap/2; a.y-=ny*overlap/2; }
          if(!b.dragging){ b.x+=nx*overlap/2; b.y+=ny*overlap/2; }
          const dvx=b.vx-a.vx, dvy=b.vy-a.vy, rel=dvx*nx+dvy*ny;
          if(rel<0){ const imp=-(1+REST)*rel/2;
            if(!a.dragging){ a.vx-=imp*nx; a.vy-=imp*ny; }
            if(!b.dragging){ b.vx+=imp*nx; b.vy+=imp*ny; }
          }
        }
      }
    }
  }
  function drawPote(){
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy+R*0.72, R*0.72, R*0.11, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.42)';
    ctx.filter = 'blur(10px)';
    ctx.fill();
    ctx.filter = 'none';
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
    const glass = ctx.createRadialGradient(cx-R*0.3,cy-R*0.3,R*0.1, cx,cy,R);
    glass.addColorStop(0,'rgba(255,255,255,0.105)');
    glass.addColorStop(0.48,'rgba(255,179,71,0.026)');
    glass.addColorStop(1,'rgba(255,255,255,0.012)');
    ctx.fillStyle = glass; ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx,cy,R-12,0,Math.PI*2);
    ctx.strokeStyle = 'rgba(255,179,71,0.08)';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + glassLight * R * .18, cy - glassLight * R * .08, R-6, Math.PI*1.15, Math.PI*1.55);
    ctx.strokeStyle = 'rgba(255,255,255,0.46)';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + glassLight * R * .24, cy - glassLight * R * .12, R-18, Math.PI*1.82, Math.PI*2.1);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy+R+6, R*0.55, 10, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.045)';
    ctx.fill();
    ctx.restore();
  }
  // sombra de contato: reforça a leitura de profundidade das bolinhas
  // contra o "vidro" do pote, mais forte quanto mais perto do fundo.
  function drawContactShadow(b){
    const depthT = Math.max(0, Math.min(1, (b.y - cy) / R)); // 0 no centro, 1 no fundo
    const alpha = 0.05 + depthT*0.22;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(b.x, b.y + b.r*0.82, b.r*0.75, b.r*0.22, 0, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fill();
    ctx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    drawPote();
    for(const b of balls) drawContactShadow(b);
    for(const b of balls){
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.42)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 12;
      ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fillStyle=b.color; ctx.fill();
      ctx.shadowColor = 'transparent';
      const g=ctx.createRadialGradient(b.x-b.r*0.35,b.y-b.r*0.35,b.r*0.1,b.x,b.y,b.r);
      g.addColorStop(0,'rgba(255,255,255,0.72)'); g.addColorStop(0.32,'rgba(255,255,255,0.08)'); g.addColorStop(1,'rgba(0,0,0,0.36)');
      ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      ctx.beginPath();
      ctx.arc(b.x-b.r*.28,b.y-b.r*.34,b.r*.18,0,Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,.18)';
      ctx.fill();

      const icon = iconMap.get(b.label);
      if (icon){
        const s = b.r*1.1;
        ctx.drawImage(icon, b.x-s/2, b.y-s/2, s, s);
      } else {
        drawIconFallback(ctx, b.label, b.x, b.y, b.r);
      }
      ctx.restore();
    }
  }
  function loop(){ integrate(); resolve(); draw(); requestAnimationFrame(loop); }
  loop();
}
