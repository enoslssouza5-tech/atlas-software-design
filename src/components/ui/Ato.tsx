'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { definirSecaoClara } from '@/lib/fundo-signal';
import s from './Ato.module.css';

type Props = {
  id: string;
  /** nome acessível da seção, só existe pra leitor de tela */
  rotulo: string;
  children: ReactNode;
  /** fundo claro: usado em 1 ou 2 momentos da jornada, nunca alternado */
  claro?: boolean;
  className?: string;
};

/**
 * Moldura comum dos atos.
 *
 * A marcação numerada "01 / Abertura" que existia aqui foi removida da
 * tela: o nome da seção continua existindo só pra acessibilidade, via
 * `aria-labelledby` apontando pra um span `sr-only`. Os rótulos (eyebrow)
 * acima de cada H2 são outra coisa, ficam em `children`, não são tocados
 * por este componente.
 */
export function Ato({ id, rotulo, children, claro = false, className }: Props) {
  const ref = useRef<HTMLElement>(null);

  // Seção clara avisa o fundo de partículas pra clarear enquanto estiver
  // na tela. Fica centralizado aqui porque toda seção clara já passa por
  // este componente, evita repetir o mesmo ScrollTrigger em cada uma.
  useGSAP(
    () => {
      if (!claro || !ref.current) return;
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => definirSecaoClara(id, self.isActive),
      });
      return () => {
        definirSecaoClara(id, false);
        st.kill();
      };
    },
    { scope: ref, dependencies: [claro, id] },
  );

  return (
    <section
      id={id}
      ref={ref}
      className={[s.raiz, claro ? s.claro : '', className].filter(Boolean).join(' ')}
      data-tom={claro ? 'claro' : 'escuro'}
      aria-labelledby={`${id}-rotulo`}
    >
      <div className="container">
        <span className="sr-only" id={`${id}-rotulo`}>
          {rotulo}
        </span>
        {children}
      </div>
    </section>
  );
}
