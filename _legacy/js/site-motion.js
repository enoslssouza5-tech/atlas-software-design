import { animate, stagger, createTimeline } from 'animejs';

export function initSiteMotion(){
  window.__animeReady = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('scroll-progress');
  const links = Array.from(document.querySelectorAll('nav .links a'));
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  function updateProgress(){
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  }
  addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin:'-38% 0px -55% 0px', threshold:0.01 });
  sections.forEach(section => spy.observe(section));

  document.querySelectorAll('.depth-section').forEach(section => {
    const layers = section.querySelectorAll('.depth-orbit');
    const update = () => {
      const r = section.getBoundingClientRect();
      const t = (innerHeight - r.top) / (innerHeight + r.height);
      layers.forEach((layer, i) => layer.style.transform = `translate3d(${(t-.5)*(i?34:-22)}px, ${(t-.5)*(i?70:38)}px, 0) rotate(${(t-.5)*(i?18:-12)}deg)`);
    };
    addEventListener('scroll', () => requestAnimationFrame(update), { passive:true });
    update();
  });

  if(reduced){
    document.querySelectorAll('.reveal,.hero-title .word').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }

  createTimeline({ defaults:{ ease:'out(3)', duration:850 } })
    .add('.navbar', { opacity:[0,1], translateY:[-24,0], duration:700 })
    .add('.hero-badges-layer', { opacity:[0,1], translateY:[18,0] }, '-=430')
    .add('#hero .tag', { opacity:[0,1], translateY:[22,0] }, '-=360')
    .add('.hero-title .word', { opacity:[0,1], translateY:[46,0], delay:stagger(55) }, '-=360')
    .add('#hero .desc', { opacity:[0,1], translateY:[22,0] }, '-=480');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      animate(entry.target, { opacity:[0,1], translateY:[34,0], duration:850, ease:'out(3)' });
      io.unobserve(entry.target);
    });
  }, { threshold:.16 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
