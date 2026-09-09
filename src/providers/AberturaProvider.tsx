'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type Abertura = {
  /** o preloader saiu de cena — o Ato 1 pode respirar e começar */
  liberado: boolean;
  liberar: () => void;
};

const Ctx = createContext<Abertura>({ liberado: false, liberar: () => {} });

export const useAbertura = () => useContext(Ctx);

/**
 * Sincroniza a saída do preloader com a entrada do Hero.
 * Sem isso, a timeline do Ato 1 rodaria atrás da cortina preta e o usuário
 * chegaria numa página já animada — perdendo justamente a abertura.
 */
export function AberturaProvider({ children }: { children: ReactNode }) {
  const [liberado, setLiberado] = useState(false);
  const liberar = useCallback(() => setLiberado(true), []);
  const valor = useMemo(() => ({ liberado, liberar }), [liberado, liberar]);
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
