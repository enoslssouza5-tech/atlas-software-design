// Sistema de scroll-reveal (blur + translateY). Puro IntersectionObserver,
// não depende de nenhuma CDN — a variante reduzida é resolvida via CSS
// (prefers-reduced-motion), aqui só cuidamos de marcar '.visible'.
export function initReveal(selector = '.reveal'){
  const items = document.querySelectorAll(selector);
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold:0.2 });
  items.forEach(el=>io.observe(el));
  return io;
}
