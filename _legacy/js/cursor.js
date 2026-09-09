// Cursor customizado com lerp. Desativado inteiramente em touch (pointer: coarse).
export function initCursor(cursorEl){
  if (matchMedia('(pointer: coarse)').matches) return;

  document.documentElement.classList.add('has-custom-cursor');

  let mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
  window.addEventListener('mousemove', e=>{ mx = e.clientX; my = e.clientY; });

  function loop(){
    cx += (mx-cx)*0.18; cy += (my-cy)*0.18;
    cursorEl.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  function bindHoverTargets(){
    document.querySelectorAll('a, button, .proj-card, .badge-card').forEach(el=>{
      el.addEventListener('mouseenter', ()=>cursorEl.classList.add('hover'));
      el.addEventListener('mouseleave', ()=>cursorEl.classList.remove('hover'));
    });
  }
  bindHoverTargets();
  return { rebind: bindHoverTargets };
}
