/**
 * Ponte entre as seções claras (`Ato claro`) e o fundo de partículas.
 *
 * Mais de uma seção clara pode estar "saindo"/"entrando" ao mesmo tempo
 * durante a transição do scroll, por isso é um conjunto de ids ativos, não
 * um booleano isolado.
 */

const ativos = new Set<string>();

export function definirSecaoClara(id: string, ativa: boolean) {
  if (ativa) ativos.add(id);
  else ativos.delete(id);
}

/**
 * Ids das seções claras ativas agora mesmo. O fundo de partículas usa isso
 * pra medir (via `getBoundingClientRect`) onde essas seções ficam na tela
 * de verdade, e recortar a cor exatamente na borda real delas, em vez de
 * clarear a tela inteira de uma vez.
 *
 * Um id aqui não garante que o elemento está perto da tela agora: quem lê
 * esta lista (`ParticleWave.tsx`) ainda descarta qualquer retângulo que já
 * não intersecte a viewport atual, pro recorte nunca se espalhar até uma
 * seção que ficou presa no conjunto por engano.
 */
export function idsSecaoClaraAtiva(): string[] {
  return Array.from(ativos);
}
