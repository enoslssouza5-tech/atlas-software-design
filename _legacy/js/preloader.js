// Preloader cinematográfico: acompanha o carregamento real dos assets, mas
// nunca é instantâneo — tem duração mínima perceptível, easing que desacelera
// perto de 100% (sensação de "assentar") e pausa antes do fade-out.
//
// A porcentagem só passa de 96% quando os assets realmente terminaram, então
// o número continua refletindo carregamento real em vez de ser decorativo.
export async function runPreloader({
  preloaderEl, mainEl, percentEl,
  assetPromises = [],
  minDurationMs = 2600,
  safetyTimeoutMs = 8000,
}){
  const start = performance.now();
  let assetsDone = false;

  Promise.allSettled(assetPromises).then(()=>{ assetsDone = true; });
  setTimeout(()=>{ assetsDone = true; }, safetyTimeoutMs);

  let displayed = 0;
  await new Promise(resolve => {
    function tick(){
      const elapsed = performance.now() - start;
      const raw = Math.min(elapsed / minDurationMs, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      const cap = assetsDone ? 100 : 96; // segura perto do fim até os assets chegarem
      const target = Math.min(eased * 100, cap);
      displayed += (target - displayed) * 0.25;
      if(target >= 99.5) displayed = 100;
      percentEl.textContent = Math.floor(displayed) + '%';

      if(elapsed < minDurationMs || displayed < 99.9) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });

  // pequena pausa em 100% antes de sair, evita corte abrupto
  await new Promise(r => setTimeout(r, 450));

  preloaderEl.classList.add('done');
  mainEl.classList.add('show');
}
