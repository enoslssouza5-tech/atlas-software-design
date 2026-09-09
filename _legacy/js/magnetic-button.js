// Botão magnético — desloca proporcionalmente à posição do mouse.
export function initMagneticButton(btn){
  if (matchMedia('(pointer: coarse)').matches) return;

  btn.addEventListener('mousemove', (e)=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*0.35}px, ${y*0.35}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform = 'translate(0,0)'; });
}
