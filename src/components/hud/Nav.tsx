'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, FolderKanban, Boxes, CircleHelp } from 'lucide-react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useAbertura } from '@/providers/AberturaProvider';
import { useLenis } from '@/providers/LenisProvider';
import { Botao } from '@/components/ui/Botao';
import s from './Nav.module.css';

const LINKS = [
  { rotulo: 'Serviços', alvo: '#ato-solucao', icone: Layers },
  { rotulo: 'Projetos', alvo: '#ato-projetos', icone: FolderKanban },
  { rotulo: 'Stack', alvo: '#ato-stack', icone: Boxes },
  { rotulo: 'Dúvidas', alvo: '#ato-oferta', icone: CircleHelp },
];

/** equivalente ao power3.out/--ease-cine do projeto, sem spring nem bounce */
const EASE_CAPSULA: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * HUD superior: logo fora da cápsula à esquerda, cápsula flutuante com os
 * itens reais no centro, CTA fora da cápsula à direita.
 *
 * A entrada e o indicador da aba ativa usam framer-motion (pedido
 * explícito do cliente pra este componente, única exceção à regra de
 * GSAP-pra-tudo do projeto). Sem mascote: só a cápsula e o brilho laranja
 * seguindo a aba ativa, sem bounce nem elastic, igual ao resto do site.
 */
export function Nav() {
  const { liberado } = useAbertura();
  const { irPara } = useLenis();
  const [ativo, setAtivo] = useState(LINKS[0].rotulo);
  const [solido, setSolido] = useState(false);

  useEffect(() => {
    const gatilhos = LINKS.map((l) => {
      const alvo = document.querySelector(l.alvo);
      if (!alvo) return null;
      return ScrollTrigger.create({
        trigger: alvo,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) setAtivo(l.rotulo);
        },
      });
    });

    const fundo = ScrollTrigger.create({
      start: 'top -80',
      onEnter: () => setSolido(true),
      onLeaveBack: () => setSolido(false),
    });

    return () => {
      gatilhos.forEach((g) => g?.kill());
      fundo.kill();
    };
  }, []);

  useGSAP(() => {
    // refresh depois que os outros ScrollTriggers da página existirem,
    // senão os alvos acima podem medir contra um documento ainda incompleto
    const quadro = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(quadro);
  }, []);

  const navegar = (e: React.MouseEvent<HTMLAnchorElement>, alvo: string) => {
    e.preventDefault();
    irPara(alvo);
  };

  return (
    <motion.header
      className={s.raiz}
      data-solido={solido}
      initial={{ opacity: 0, y: -30 }}
      animate={liberado ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
      transition={{ duration: 0.62, ease: EASE_CAPSULA, delay: liberado ? 1.6 : 0 }}
    >
      <a href="#ato-hero" className={s.marca} onClick={(e) => navegar(e, '#ato-hero')}>
        <span className={s.nome}>ATLAS</span>
      </a>

      <nav className={s.capsula} aria-label="Seções da página">
        {LINKS.map((l) => {
          const Icone = l.icone;
          const estaAtivo = ativo === l.rotulo;
          return (
            <a
              key={l.alvo}
              href={l.alvo}
              className={s.link}
              data-ativo={estaAtivo}
              onClick={(e) => navegar(e, l.alvo)}
            >
              {estaAtivo && (
                <motion.span
                  layoutId="nav-indicador"
                  className={s.indicador}
                  transition={{ duration: 0.42, ease: EASE_CAPSULA }}
                >
                  <motion.span
                    className={s.brilho}
                    animate={{ opacity: [0.5, 0.85, 0.5] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.span>
              )}
              <span className={s.linkTexto}>{l.rotulo}</span>
              <Icone className={s.linkIcone} size={18} strokeWidth={2} aria-hidden="true" />
            </a>
          );
        })}
      </nav>

      <Botao className={s.cta} onClick={() => irPara('#ato-convite')} aria="Falar com a Atlas">
        Falar com a Atlas
      </Botao>
    </motion.header>
  );
}
