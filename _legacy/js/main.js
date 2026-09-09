import { initGrain } from './grain.js';
import { initCursor } from './cursor.js';
import { runPreloader } from './preloader.js';
import { initProjects } from './projects-scroll.js';
import { initProcessLine } from './process-line.js';
import { preloadBallIcons, initBallPit } from './ball-pit.js';
import { initMagneticButton } from './magnetic-button.js';
import { initHeroParallax } from './parallax.js';
import { initSiteMotion } from './site-motion.js';

if (matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.classList.add('has-reduced-motion');
}

// Camadas globais, independentes do preloader.
initGrain(document.getElementById('grain'));
initCursor(document.getElementById('cursor'));

// Nav ganha fundo mais denso ao rolar.
(function initNavScroll(){
  const nav = document.querySelector('nav');
  let ticking = false;
  function update(){
    nav.classList.toggle('scrolled', window.scrollY > 40);
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, { passive:true });
  update();
})();

// Assets reais que o preloader acompanha. Os ícones das bolinhas são o item
// pesado e ficam no gate inteiro. A fonte de destaque entra com teto de 1.5s:
// ela usa `display=swap`, então segurar o site esperando o Google Fonts só
// atrasaria a entrada sem ganho visual.
const iconsReady = preloadBallIcons();
const fontsReady = Promise.race([
  (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve(),
  new Promise(r => setTimeout(r, 1500)),
]);

async function boot(){
  await runPreloader({
    preloaderEl: document.getElementById('preloader'),
    mainEl: document.getElementById('main'),
    percentEl: document.getElementById('pl-percent'),
    assetPromises: [fontsReady, iconsReady],
    minDurationMs: 3000,
  });

  // Crachás — gerados a partir dos dados dos sócios.
  const { initHeroScene } = await import('./hero-scene.js');
  initHeroScene(document.getElementById('hero-three'), document.getElementById('hero'));

  // Projetos — pin-scroll horizontal + tilt 3D nos mockups.
  initProjects({
    outerEl: document.getElementById('projects-outer'),
    trackEl: document.getElementById('proj-track'),
  });

  // Processo — linha vertical progressiva.
  initProcessLine({
    wrapEl: document.getElementById('process-wrap'),
    fillEl: document.getElementById('process-fill'),
  });

  // Stack — pote de bolinhas com física de colisão.
  initBallPit(document.getElementById('stack-section'), document.getElementById('ball-pit-canvas'));

  // CTA magnético.
  initMagneticButton(document.getElementById('cta-btn'));
  const { initContactScene } = await import('./contact-scene.js');
  initContactScene(document.getElementById('contact-three'), document.getElementById('cta'));

  // Parallax de profundidade no hero.
  initHeroParallax({
    heroEl: document.getElementById('hero'),
    glowEl: document.querySelector('#hero .hero-glow'),
    badgesLayerEl: document.querySelector('#hero .hero-badges-layer'),
  });

  // Reveal por scroll — depois que tudo já está no DOM.
  initSiteMotion();

  // Cursor precisa "reconhecer" os crachás/cards recém-criados.
  const cursor = document.getElementById('cursor');
  if (!matchMedia('(pointer: coarse)').matches){
    document.querySelectorAll('.badge-card, .proj-card').forEach(el=>{
      el.addEventListener('mouseenter', ()=>cursor.classList.add('hover'));
      el.addEventListener('mouseleave', ()=>cursor.classList.remove('hover'));
    });
  }
}

boot();
