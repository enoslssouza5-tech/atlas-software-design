import { PROJETOS } from './projects-data.js';
import { initTilt } from './tilt-3d.js';

// Mockups montados por camadas pra lerem como dispositivo real:
// tampa com bezel + webcam, base mais larga com trackpad, celular com
// notch sobrepondo o canto do notebook. Nada de retângulo liso.
function cardMarkup(p){
  const fundo = p.imagem ? `url('${p.imagem}') center/cover` : p.gradiente;
  return `
    <article class="proj-card">
      <div class="proj-stage">
        <div class="rig">
          <div class="laptop">
            <div class="laptop-lid">
              <span class="laptop-cam" aria-hidden="true"></span>
              <div class="screen" style="background:${fundo};"></div>
            </div>
            <div class="laptop-base"><span class="laptop-trackpad" aria-hidden="true"></span></div>
          </div>
          <div class="phone">
            <span class="phone-notch" aria-hidden="true"></span>
            <div class="screen" style="background:${fundo};"></div>
          </div>
        </div>
      </div>
      <h3 class="proj-title">${p.titulo}</h3>
      <p class="proj-desc">${p.desc}</p>
      <div class="proj-dots" aria-hidden="true">${p.cores.map(c => `<span style="background:${c}"></span>`).join('')}</div>
    </article>
  `;
}

// Seção "gruda" (sticky) enquanto o scroll vertical empurra o carrossel na
// horizontal — usa o scroll nativo da página, então funciona igual em mouse,
// trackpad e touch. A altura do wrapper é o que reserva o "tempo" de pin:
// viewport + a distância horizontal que o trilho ainda precisa percorrer.
function initPinScroll(outerEl, trackEl, cards){
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scrollDistance = 0;
  let ticking = false;

  function measure(){
    // largura real do conteúdo do trilho menos o que já cabe na tela,
    // + uma folga pra o último card não encostar na borda direita.
    const trackWidth = trackEl.scrollWidth;
    scrollDistance = Math.max(trackWidth - window.innerWidth + window.innerWidth*0.12, 0);
    outerEl.style.height = (window.innerHeight + scrollDistance) + 'px';
    apply();
  }

  // destaque do card no centro da tela: reforça a leitura de "um projeto
  // de cada vez" durante o pin. Só transform/opacity (GPU-safe).
  function focusCards(progress){
    if (reducedMotion) return;
    const centerX = window.innerWidth/2;
    for(const [index, card] of cards.entries()){
      const r = card.getBoundingClientRect();
      const d = Math.min(Math.abs((r.left + r.width/2) - centerX) / window.innerWidth, 1);
      const depth = 1 - d;
      const lane = index - progress * Math.max(cards.length - 1, 1);
      const rotate = Math.max(-7, Math.min(7, lane * -2.4));
      card.style.transform = `translateZ(${(depth*70).toFixed(1)}px) rotateY(${rotate.toFixed(2)}deg) scale(${(0.88 + depth*0.12).toFixed(3)})`;
      card.style.opacity = (1 - d*0.6).toFixed(3);
      card.style.filter = `blur(${(d*1.8).toFixed(2)}px)`;
    }
  }

  function apply(){
    const rect = outerEl.getBoundingClientRect();
    const progress = scrollDistance > 0
      ? Math.min(Math.max(-rect.top / scrollDistance, 0), 1)
      : 0;
    const eased = progress < .5 ? 4*progress*progress*progress : 1 - Math.pow(-2*progress+2, 3)/2;
    trackEl.style.transform = `translateX(-${eased*scrollDistance}px)`;
    focusCards(eased);
    ticking = false;
  }

  window.addEventListener('scroll', ()=>{
    if(!ticking){ requestAnimationFrame(apply); ticking = true; }
  }, { passive:true });
  window.addEventListener('resize', measure);
  measure();
}

export function initProjects({ outerEl, trackEl }){
  trackEl.innerHTML = PROJETOS.map(cardMarkup).join('');
  const cards = Array.from(trackEl.querySelectorAll('.proj-card'));
  initPinScroll(outerEl, trackEl, cards);
  trackEl.querySelectorAll('.rig').forEach(rig => initTilt(rig));
}
