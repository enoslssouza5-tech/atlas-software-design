'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useAbertura } from '@/providers/AberturaProvider';
import { useLenis } from '@/providers/LenisProvider';
import { MarcaA } from '@/components/ui/MarcaA';
import { DUR, EASE, SILENCIO } from '@/lib/motion-tokens';
import s from './Nav.module.css';

const LINKS = [
  { rotulo: 'Serviços', alvo: '#ato-solucao' },
  { rotulo: 'Projetos', alvo: '#ato-projetos' },
  { rotulo: 'Stack', alvo: '#ato-stack' },
  { rotulo: 'Dúvidas', alvo: '#ato-oferta' },
];

/**
 * HUD superior. Entra por último no Ato 1, depois da headline, da sub e do
 * CTA. A interface só aparece quando a cena já se apresentou.
 */
export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const { liberado } = useAbertura();
  const { irPara } = useLenis();

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;
      if (!liberado) {
        gsap.set(raiz, { opacity: 0, y: -30 });
        return;
      }

      gsap.to(raiz, {
        opacity: 1,
        y: 0,
        duration: DUR.media,
        ease: EASE.entrada,
        // silêncio do Ato 1 + a headline inteira passam antes
        delay: SILENCIO.hero + 1.18,
      });

      // fundo entra só depois que a página sai do topo
      const st = ScrollTrigger.create({
        start: 'top -80',
        onEnter: () => raiz.setAttribute('data-solido', 'true'),
        onLeaveBack: () => raiz.setAttribute('data-solido', 'false'),
      });

      return () => st.kill();
    },
    { scope: ref, dependencies: [liberado] },
  );

  const navegar = (e: React.MouseEvent<HTMLAnchorElement>, alvo: string) => {
    e.preventDefault();
    irPara(alvo);
  };

  return (
    <header className={s.raiz} ref={ref} data-solido="false">
      <a href="#ato-hero" className={s.marca} onClick={(e) => navegar(e, '#ato-hero')}>
        <MarcaA className={s.icone} titulo="Atlas Software & Design" />
        <span className={s.nome}>
          Atlas <span className={s.leve}>Software &amp; Design</span>
        </span>
      </a>

      <nav className={s.links} aria-label="Seções da página">
        {LINKS.map((l) => (
          <a key={l.alvo} href={l.alvo} className={s.link} onClick={(e) => navegar(e, l.alvo)}>
            {l.rotulo}
          </a>
        ))}
      </nav>

      <a href="#ato-convite" className={s.cta} onClick={(e) => navegar(e, '#ato-convite')}>
        Falar com a Atlas
      </a>
    </header>
  );
}
