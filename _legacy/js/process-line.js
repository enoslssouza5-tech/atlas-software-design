// Linha vertical numerada progressiva — preenche a altura conforme o
// scroll avança pela seção, acende cada número na sua posição relativa.
export function initProcessLine({ wrapEl, fillEl, stepsSelector = '#processo .step' }){
  const steps = Array.from(document.querySelectorAll(stepsSelector));

  function onScroll(){
    const rect = wrapEl.getBoundingClientRect();
    const vh = window.innerHeight;
    let progress = (vh*0.7 - rect.top) / (rect.height*0.9);
    progress = Math.min(Math.max(progress, 0), 1);
    fillEl.style.height = (progress*100) + '%';
    const center = vh * 0.52;
    let activeIndex = 0;
    let activeDistance = Infinity;
    steps.forEach((step, i) => {
      const stepRect = step.getBoundingClientRect();
      const stepCenter = stepRect.top + stepRect.height / 2;
      const distance = Math.abs(stepCenter - center);
      if(distance < activeDistance){
        activeDistance = distance;
        activeIndex = i;
      }
    });
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === activeIndex);
      step.classList.toggle('past', i < activeIndex);
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  onScroll();
}
