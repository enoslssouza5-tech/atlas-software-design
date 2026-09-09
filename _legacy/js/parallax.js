// Parallax de profundidade no hero — só transform, throttled via rAF.
// Desativado com prefers-reduced-motion; intensidade reduzida em touch.
export function initHeroParallax({ heroEl, glowEl, badgesLayerEl }){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const isTouch = matchMedia('(pointer: coarse)').matches;
  const glowSpeed = isTouch ? 0.08 : 0.2;
  const badgesSpeed = isTouch ? 0.15 : 0.4;

  let ticking = false;
  function update(){
    const rect = heroEl.getBoundingClientRect();
    const offset = -rect.top; // 0 quando o hero está no topo da viewport
    if (offset > -window.innerHeight && offset < heroEl.offsetHeight){
      glowEl.style.transform = `translateY(${offset*glowSpeed}px)`;
      badgesLayerEl.style.transform = `translateY(${offset*badgesSpeed}px)`;
    }
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if (!ticking){ requestAnimationFrame(update); ticking = true; }
  }, { passive:true });
  update();
}
