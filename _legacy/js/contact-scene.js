import * as THREE from 'three';

function canUseWebGL(){
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch { return false; }
}

export function initContactScene(canvas, section){
  if(!canvas || !section || !canUseWebGL()) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, .1, 20);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1 : 1.5));
  const count = innerWidth < 768 ? 150 : 260;
  const start = new Float32Array(count*3);
  const target = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const a = i/count * Math.PI * 2;
    const r = 1.35 + Math.sin(i*.7)*.035;
    start[i*3]=(Math.random()-.5)*5; start[i*3+1]=(Math.random()-.5)*3; start[i*3+2]=(Math.random()-.5)*2;
    target[i*3]=Math.cos(a)*r; target[i*3+1]=Math.sin(a)*r; target[i*3+2]=0;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(start.slice(),3));
  const mat = new THREE.PointsMaterial({ color:'#b23e0e', size:.035, transparent:true, opacity:.78 });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  let progress = 0;
  const io = new IntersectionObserver(entries=>{
    if(entries.some(e=>e.isIntersecting)) progress = 1;
  }, { threshold:.28 });
  io.observe(section);
  function resize(){
    const r=section.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect=r.width/r.height; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();
  function loop(){
    const pos = geo.attributes.position.array;
    const ease = reduced ? 1 : .035;
    for(let i=0;i<pos.length;i++) pos[i] += ((progress ? target[i] : start[i]) - pos[i]) * ease;
    geo.attributes.position.needsUpdate = true;
    if(!reduced) pts.rotation.z += .0018;
    renderer.render(scene,camera);
    requestAnimationFrame(loop);
  }
  loop();
}
