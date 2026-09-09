'use client';

import { useEffect, useState } from 'react';

export type DeviceTier = {
  /** viewport estreito — cena 3D reduzida, menos bolinhas */
  mobile: boolean;
  /** usuário pediu menos movimento — nada anima, tudo continua visível */
  reduzido: boolean;
  /** WebGL disponível — se falso, a cena 3D vira imagem estática */
  webgl: boolean;
  /** conexão econômica ou lenta — mesma consequência do webgl falso */
  economico: boolean;
  /** já resolvido no cliente; antes disso não decidimos nada */
  pronto: boolean;
};

const INICIAL: DeviceTier = {
  mobile: false,
  reduzido: false,
  webgl: true,
  economico: false,
  pronto: false,
};

function testarWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

type ConexaoLenta = {
  saveData?: boolean;
  effectiveType?: string;
};

function testarConexao(): boolean {
  const nav = navigator as Navigator & { connection?: ConexaoLenta };
  const c = nav.connection;
  if (!c) return false;
  if (c.saveData) return true;
  return c.effectiveType === 'slow-2g' || c.effectiveType === '2g';
}

/**
 * Uma leitura só do aparelho, compartilhada por toda a página.
 * Nunca decide nada no servidor: até `pronto` virar true, assume o
 * caminho conservador (fallback estático).
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(INICIAL);

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 768px)');
    const mqReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

    const ler = () =>
      setTier({
        mobile: mqMobile.matches,
        reduzido: mqReduzido.matches,
        webgl: testarWebGL(),
        economico: testarConexao(),
        pronto: true,
      });

    ler();
    mqMobile.addEventListener('change', ler);
    mqReduzido.addEventListener('change', ler);

    return () => {
      mqMobile.removeEventListener('change', ler);
      mqReduzido.removeEventListener('change', ler);
    };
  }, []);

  return tier;
}

/** Atalho: a cena 3D deve rodar de verdade, ou virar imagem estática? */
export function cena3dViavel(tier: DeviceTier): boolean {
  return tier.pronto && tier.webgl && !tier.economico;
}
