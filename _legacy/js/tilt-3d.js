// Tilt 3D em hover (mousemove) — só desktop (pointer: fine) e só se o
// usuário não pediu motion reduzido. Transform-only, GPU-safe.
export function initTilt(el, { maxDeg = 8 } = {}){
  const enabled = matchMedia('(pointer: fine)').matches &&
                  !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!enabled) return;

  const parent = el.parentElement;
  function onMove(e){
    const r = parent.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;  // 0..1
    const py = (e.clientY - r.top) / r.height;  // 0..1
    const rotY = (px - 0.5) * maxDeg * 2;
    const rotX = (0.5 - py) * maxDeg * 2;
    el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }
  function onLeave(){
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }
  parent.addEventListener('mousemove', onMove);
  parent.addEventListener('mouseleave', onLeave);
}
