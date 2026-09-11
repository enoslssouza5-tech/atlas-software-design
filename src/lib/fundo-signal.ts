/**
 * Ponte entre as seções claras (`Ato claro`) e o fundo de partículas.
 *
 * Mais de uma seção clara pode estar "saindo"/"entrando" ao mesmo tempo
 * durante a transição do scroll, por isso é um conjunto de ids ativos, não
 * um booleano isolado: só quando o conjunto fica vazio é que o fundo volta
 * a escurecer.
 */

const ativos = new Set<string>();
type Ouvinte = (claro: boolean) => void;
const ouvintes = new Set<Ouvinte>();

export function definirSecaoClara(id: string, ativa: boolean) {
  const antes = ativos.size > 0;
  if (ativa) ativos.add(id);
  else ativos.delete(id);
  const depois = ativos.size > 0;
  if (antes !== depois) ouvintes.forEach((fn) => fn(depois));
}

/** Avisa o fundo de partículas quando deve clarear ou escurecer. */
export function aoMudarTom(fn: Ouvinte) {
  ouvintes.add(fn);
  return () => {
    ouvintes.delete(fn);
  };
}
