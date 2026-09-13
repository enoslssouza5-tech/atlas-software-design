'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useLenis } from '@/providers/LenisProvider';
import { useAbertura } from '@/providers/AberturaProvider';
import { EASE } from '@/lib/motion-tokens';
import s from './Preloader.module.css';

/**
 * Teto duro. Cobre os cerca de 3s do vídeo da logo mais o resto da
 * timeline (nome, cortina abrindo pros lados), com folga de segurança.
 * Bem maior que o teto anterior de 2.5s, pensado pra uma animação sem
 * vídeo (fade e escala de um SVG).
 */
const TETO_MS = 4800;

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [saiu, setSaiu] = useState(false);
  const { travar } = useLenis();
  const { liberar } = useAbertura();

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;

      // O site sempre recarrega mostrando o Hero do topo, nunca a posição
      // de scroll de uma navegação anterior, mesmo quando a animação abaixo
      // é pulada por `prefers-reduced-motion`.
      window.scrollTo(0, 0);

      const concluir = () => {
        travar(false);
        liberar();
        setSaiu(true);
      };

      // A abertura do Ato 1 começa junto com a cortina abrindo, não depois
      // dela. Esperar a cortina terminar empurrava o CTA pra tarde demais
      // na página, e faz a cortina parecer estar revelando uma tela vazia.
      const liberarCedo = () => {
        travar(false);
        liberar();
      };

      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduzido) {
        concluir();
        return;
      }

      travar(true);

      let iniciado = false;

      // Sequência de saída, disparada uma única vez: nome entra, pausa
      // breve, o conteúdo central some, e as duas metades da cortina se
      // separam revelando o site no meio.
      const abrirCortina = () => {
        if (iniciado) return;
        iniciado = true;
        clearTimeout(teto);

        gsap
          .timeline({ onComplete: concluir })
          .fromTo(
            `.${s.saudacao}`,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.62, ease: EASE.entrada },
          )
          .to(`.${s.centro}`, { opacity: 0, duration: 0.38, ease: 'power2.in' }, '+=0.32')
          .to(
            `.${s.metadeEsquerda}`,
            { xPercent: -100, duration: 0.62, ease: EASE.entrada, onStart: liberarCedo },
            '-=0.12',
          )
          .to(`.${s.metadeDireita}`, { xPercent: 100, duration: 0.62, ease: EASE.entrada }, '<');
      };

      // Emergência: se o vídeo nunca carregar nem terminar, o teto duro
      // força uma saída rápida, sem a sequência inteira em etapas.
      const forcarSaida = () => {
        if (iniciado) return;
        iniciado = true;
        gsap.set(`.${s.centro}`, { opacity: 0 });
        gsap
          .timeline({ onComplete: concluir })
          .to(`.${s.metadeEsquerda}`, {
            xPercent: -100,
            duration: 0.42,
            ease: EASE.entrada,
            onStart: liberarCedo,
          })
          .to(`.${s.metadeDireita}`, { xPercent: 100, duration: 0.42, ease: EASE.entrada }, '<');
      };

      // O nome entra perto do fim real do vídeo, não só depois dele: a
      // antecedência de 0.34s repete o mesmo espaçamento negativo que essa
      // transição já usava quando a etapa anterior era um fade de SVG, em
      // vez de assumir uma duração fixa de arquivo.
      const video = raiz.querySelector<HTMLVideoElement>(`.${s.marca}`);
      const ANTECEDENCIA = 0.34;
      const aoAtualizarVideo = () => {
        if (!video) return;
        if (video.duration - video.currentTime <= ANTECEDENCIA) {
          video.removeEventListener('timeupdate', aoAtualizarVideo);
          abrirCortina();
        }
      };

      if (video) {
        video.addEventListener('timeupdate', aoAtualizarVideo);
        video.addEventListener('ended', abrirCortina, { once: true });
      } else {
        abrirCortina();
      }

      const teto = window.setTimeout(forcarSaida, TETO_MS);

      return () => {
        clearTimeout(teto);
        video?.removeEventListener('timeupdate', aoAtualizarVideo);
        video?.removeEventListener('ended', abrirCortina);
        travar(false);
      };
    },
    { scope: ref },
  );

  if (saiu) return null;

  return (
    <div className={s.raiz} ref={ref} id="preloader" aria-hidden="true">
      <div className={s.metadeEsquerda} />
      <div className={s.metadeDireita} />
      <div className={s.centro}>
        <video className={s.marca} src="/preloader-logo.mp4" autoPlay muted playsInline />
        <p className={s.saudacao}>
          Atlas Software <span className={s.amp}>&amp;</span> Design
        </p>
      </div>
    </div>
  );
}
