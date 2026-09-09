import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const BADGES = [
  { name: 'Enos Lira', role: 'SÓCIO ADMINISTRADOR', initial: 'E', x: -1.08 },
  { name: 'Lucas Britto', role: 'DIRETOR COMERCIAL', initial: 'L', x: 1.08 },
];

const CARD_MODEL_URL = '/models/id_card_model/scene.gltf';
const CARD_TARGET_HEIGHT = 1.16; // matches the previous BoxGeometry card height

// Swing physics (Verlet spring-damper). Values chosen after simulating and
// visually comparing candidates -- see updateBadge() for how they're used.
// Exposed on window so they can be tuned live without a rebuild.
const SWING_TUNING = {
  idle: { springK: 0.02, damping: 0.86, impulseDecay: 0.87 },
  dragging: { springK: 0.02, damping: 0.965, impulseDecay: 0.87 },
};
if (typeof window !== 'undefined') window.__swingTuning = SWING_TUNING;

let cardModelPromise = null;
function loadCardModel(){
  if(!cardModelPromise){
    cardModelPromise = new GLTFLoader().loadAsync(CARD_MODEL_URL);
  }
  return cardModelPromise;
}

function buildCardFromModel(gltf, data){
  const root = gltf.scene.clone(true);
  const ribbon = root.getObjectByName('Ribbon_4');
  if(ribbon && ribbon.parent) ribbon.parent.remove(ribbon);

  const cardMesh = root.getObjectByName('Object_4');
  if(cardMesh){
    cardMesh.material = cardMesh.material.clone();
    cardMesh.material.map = badgeTexture(data);
    // Source material ships alphaMode:"BLEND" for a subtle baked vignette,
    // but our canvas texture is fully opaque -- keep it opaque so it
    // depth-sorts correctly against other transparent scene objects.
    cardMesh.material.transparent = false;
    cardMesh.material.opacity = 1;
    cardMesh.material.depthWrite = true;
    cardMesh.material.depthTest = true;
    cardMesh.material.map.needsUpdate = true;
    cardMesh.material.needsUpdate = true;
  }
  const plasticMesh = root.getObjectByName('Object_6');
  if(plasticMesh){
    // The source material uses KHR_materials_transmission (real glass
    // refraction), which makes three.js capture+blur whatever sits behind
    // the card into this mesh. Against our busy wireframe/particle
    // background that turns into an opaque gray haze that hides the card
    // entirely. A flat alpha-blended sheen gives the same "clear plastic
    // sleeve" read without the background-capture pass.
    plasticMesh.material.transmission = 0;
    // The source alpha (.25) is tuned for transmission-based refraction;
    // as flat alpha blending it reads as a foggy gray slab that hides the
    // text underneath, so dial it back to a subtle gloss instead.
    plasticMesh.material.opacity = 0.08;
    plasticMesh.material.needsUpdate = true;
  }

  root.traverse(node => {
    if(node.isMesh){ node.castShadow = true; node.receiveShadow = true; }
  });

  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = CARD_TARGET_HEIGHT / (size.y || 1);
  root.scale.setScalar(scale);
  root.position.sub(center.multiplyScalar(scale));

  return { group: root, mesh: cardMesh };
}

function canUseWebGL(){
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

function badgeTexture(data){
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  const bg = ctx.createLinearGradient(0, 0, 512, 720);
  bg.addColorStop(0, '#29292d');
  bg.addColorStop(.58, '#111113');
  bg.addColorStop(1, '#070707');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 720);
  ctx.strokeStyle = 'rgba(255,255,255,.14)';
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, 476, 684);
  ctx.fillStyle = 'rgba(255,255,255,.08)';
  ctx.beginPath();
  ctx.arc(256, 52, 16, 0, Math.PI * 2);
  ctx.fill();

  const avatar = ctx.createRadialGradient(228, 136, 8, 256, 172, 82);
  avatar.addColorStop(0, '#ffd28b');
  avatar.addColorStop(.42, '#ffb347');
  avatar.addColorStop(1, '#ff5e1a');
  ctx.fillStyle = avatar;
  ctx.beginPath();
  ctx.arc(256, 172, 78, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0a0a0a';
  ctx.font = '700 80px Space Grotesk, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.initial, 256, 176);

  ctx.fillStyle = '#f2eee6';
  ctx.font = '700 42px Space Grotesk, sans-serif';
  ctx.fillText(data.name, 256, 330);
  ctx.fillStyle = '#a49a8f';
  ctx.font = '500 24px Inter, sans-serif';
  ctx.fillText(data.role, 256, 374);

  const holo = ctx.createLinearGradient(88, 430, 424, 500);
  holo.addColorStop(0, 'rgba(255,94,26,.08)');
  holo.addColorStop(.45, 'rgba(255,179,71,.28)');
  holo.addColorStop(1, 'rgba(255,255,255,.05)');
  ctx.fillStyle = holo;
  ctx.fillRect(88, 430, 336, 70);
  ctx.fillStyle = 'rgba(255,179,71,.58)';
  for(let x = 92; x < 420; x += 14) ctx.fillRect(x, 560, x % 28 ? 5 : 9, 58);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeCord(points, material){
  return new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 18, .011, 8),
    material
  );
}

function createBadge(scene, data, cardModelGltf){
  const group = new THREE.Group();
  const rest = new THREE.Vector3(data.x, .58, .92);
  group.position.copy(rest);

  const { group: card, mesh: cardMesh } = buildCardFromModel(cardModelGltf, data);
  group.add(card);

  const metal = new THREE.MeshStandardMaterial({ color:'#b8b8b8', roughness:.2, metalness:.86 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.13, .012, 12, 36), metal);
  ring.position.set(0, .51, .047);
  ring.castShadow = true;
  group.add(ring);
  const clip = new THREE.Mesh(new THREE.BoxGeometry(.34, .08, .065), metal);
  clip.position.set(0, .43, .054);
  clip.castShadow = true;
  group.add(clip);

  const cordMaterial = new THREE.MeshStandardMaterial({ color:'#ff9a35', roughness:.5, metalness:.04 });
  const topLeft = new THREE.Vector3(data.x - .32, 1.72, .82);
  const topRight = new THREE.Vector3(data.x + .32, 1.72, .82);
  const leftCord = makeCord([topLeft.clone().sub(rest), new THREE.Vector3(-.16,.76,-.02), new THREE.Vector3(0,.48,.02)], cordMaterial);
  const rightCord = makeCord([topRight.clone().sub(rest), new THREE.Vector3(.16,.76,-.02), new THREE.Vector3(0,.48,.02)], cordMaterial);
  group.add(leftCord, rightCord);
  scene.add(group);

  return {
    group, card, leftCord, rightCord, rest, topLeft, topRight,
    pos:rest.clone(), oldPos:rest.clone(), dragging:false,
    dragPoint:rest.clone(), impulse:new THREE.Vector3(), frame:0,
  };
}

function rebuildCords(item){
  const offset = item.pos.clone().sub(item.rest);
  const leftCurve = new THREE.CatmullRomCurve3([
    item.topLeft.clone().sub(item.pos),
    new THREE.Vector3(-.16 + offset.x*.18, .76, .02 - Math.abs(offset.x)*.08),
    new THREE.Vector3(0,.48,.02),
  ]);
  const rightCurve = new THREE.CatmullRomCurve3([
    item.topRight.clone().sub(item.pos),
    new THREE.Vector3(.16 + offset.x*.18, .76, .02 - Math.abs(offset.x)*.08),
    new THREE.Vector3(0,.48,.02),
  ]);
  item.leftCord.geometry.dispose();
  item.rightCord.geometry.dispose();
  item.leftCord.geometry = new THREE.TubeGeometry(leftCurve, 18, .011, 8);
  item.rightCord.geometry = new THREE.TubeGeometry(rightCurve, 18, .011, 8);
}

function updateBadge(item){
  const tuning = item.dragging ? SWING_TUNING.dragging : SWING_TUNING.idle;
  const target = item.dragging ? item.dragPoint : item.rest;
  const velocity = item.pos.clone().sub(item.oldPos).multiplyScalar(tuning.damping);
  item.oldPos.copy(item.pos);
  item.pos.add(velocity).add(target.clone().sub(item.pos).multiplyScalar(tuning.springK)).add(item.impulse);
  item.impulse.multiplyScalar(tuning.impulseDecay);

  const offset = item.pos.clone().sub(item.rest);
  if(offset.length() < .001 && item.impulse.length() < .0004 && !item.dragging){
    item.pos.copy(item.rest);
    item.oldPos.copy(item.rest);
  }
  item.group.position.copy(item.pos);
  item.group.rotation.y = THREE.MathUtils.clamp(offset.x * .55, -.22, .22);
  item.group.rotation.z = THREE.MathUtils.clamp(-offset.x * .36, -.16, .16);
  item.group.rotation.x = THREE.MathUtils.clamp(offset.z * .4, -.12, .12);

  item.frame = (item.frame + 1) % 2;
  if(item.dragging || offset.length() > .002) rebuildCords(item);
}

export function initHeroScene(canvas, heroEl){
  if(!canvas || !heroEl || !canUseWebGL()){
    document.documentElement.classList.add('webgl-failed');
    return false;
  }
  try{
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    // far was 80 for a scene that only spans ~8 units from the camera; that
    // huge near/far ratio compresses depth-buffer precision right where the
    // badges and the wireframe core sit, causing z-fighting where they
    // overlap on screen (the farther, transparent core would incorrectly
    // draw over the nearer, opaque badge card). 20 comfortably covers the
    // scene with headroom and restores normal depth precision there.
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 20);
    camera.position.set(0, .08, 5.35);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.15 : 1.6));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene.add(new THREE.AmbientLight(0xffddbb, .52));
    const key = new THREE.DirectionalLight(0xffb347, 2.6);
    key.position.set(-3.8, 4.6, 4.2);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.PointLight(0xff5e1a, 2.9, 8);
    rim.position.set(3.2, 1.8, 2.4);
    scene.add(rim);

    const badges = [];
    loadCardModel().then(gltf => {
      BADGES.forEach(data => badges.push(createBadge(scene, data, gltf)));
    }).catch(err => console.error('Failed to load id card model', err));
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.5), new THREE.ShadowMaterial({ opacity:.2 }));
    shadowPlane.position.set(0, -.82, .3);
    shadowPlane.rotation.x = -Math.PI/2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0,0,1), -.92);
    let active = null;
    let lastScrollY = scrollY;
    function setPointer(e){
      const r=canvas.getBoundingClientRect();
      const t=e.touches ? e.touches[0] : e;
      pointer.x=((t.clientX-r.left)/r.width)*2-1;
      pointer.y=-((t.clientY-r.top)/r.height)*2+1;
    }
    function down(e){
      setPointer(e);
      raycaster.setFromCamera(pointer,camera);
      const hits=raycaster.intersectObjects(badges.map(b=>b.card), true);
      if(!hits[0]) return;
      active=badges.find(b=>{
        let o = hits[0].object;
        while(o){ if(o===b.card) return true; o=o.parent; }
        return false;
      });
      active.dragging=true;
      active.oldPos.copy(active.pos);
    }
    function move(e){
      setPointer(e);
      if(active){
        raycaster.setFromCamera(pointer,camera);
        raycaster.ray.intersectPlane(dragPlane, active.dragPoint);
      }
    }
    function up(){
      if(active) active.dragging=false;
      active=null;
    }
    function scrollImpulse(){
      const delta = THREE.MathUtils.clamp(scrollY - lastScrollY, -80, 80);
      lastScrollY = scrollY;
      if(Math.abs(delta) < 1 || reduced) return;
      badges.forEach((badge, i) => {
        badge.impulse.x += delta * .00032 * (i ? 1 : -1);
        badge.impulse.z += Math.abs(delta) * .00018;
      });
    }
    canvas.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('scroll', scrollImpulse, { passive:true });

    function resize(){
      const r=heroEl.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect=r.width/r.height;
      camera.updateProjectionMatrix();
    }
    addEventListener('resize', resize);
    resize();
    document.documentElement.classList.add('webgl-hero-ready');

    function loop(){
      const rect=heroEl.getBoundingClientRect();
      const scrollT=THREE.MathUtils.clamp(-rect.top / Math.max(rect.height,1),0,1);
      camera.position.z = 5.35 + scrollT*.5;
      camera.position.x += (pointer.x*.16 - camera.position.x)*.04;
      camera.position.y += (pointer.y*.08 + .08 - camera.position.y)*.04;
      camera.lookAt(0,.08,-.35);
      badges.forEach(updateBadge);
      renderer.render(scene,camera);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    return true;
  } catch {
    document.documentElement.classList.add('webgl-failed');
    return false;
  }
}
