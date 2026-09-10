/**
 * Ponte entre o ScrollTrigger e a cena 3D.
 *
 * O React não entra nesse caminho de propósito: posição de mouse e progresso
 * de scroll mudam a 60fps e re-renderizar componente a cada frame seria o
 * jeito mais caro possível de mover um objeto. O ScrollTrigger escreve aqui,
 * o useFrame lê daqui, e nenhum dos dois provoca render.
 */

export type AlvoCena = {
  /** deslocamento em unidades de cena */
  x: number;
  y: number;
  escala: number;
  opacidade: number;
};

const OCULTO: AlvoCena = { x: 0, y: 0, escala: 0.6, opacidade: 0 };

/**
 * O crachá vive só no Ato 1: nasce centralizado na própria coluna, ao lado
 * do texto, gira meia volta com o scroll local do Hero e some quando o
 * Hero sai de vista, sem reaparecer em nenhum outro ato. Nenhum roteiro de
 * posição entre seções: aqui é único destino de câmera.
 */
export const CENAS = {
  hero: { x: 1.05, y: -0.1, escala: 1, opacidade: 1 } as AlvoCena,
  heroMobile: { x: 0.26, y: -0.95, escala: 0.5, opacidade: 0.9 } as AlvoCena,

  oculto: OCULTO,
} as const;

export const sinal = {
  /** posição do ponteiro normalizada de -1 a 1 */
  mouseX: 0,
  mouseY: 0,
  /** o alvo pra onde a cena está indo agora */
  alvo: OCULTO as AlvoCena,
  /** true enquanto qualquer ato reivindica o crachá */
  ativo: false,
  /**
   * Giro de meia volta do crachá, em radianos, de 0 (face da frente) a
   * PI (face de trás). Escrito só pelo ScrollTrigger local do Ato 1, preso
   * aos limites da própria seção: fora desse intervalo o valor trava, nunca
   * continua girando nem volta a girar.
   */
  giroHero: 0,
};

type Ouvinte = (ativo: boolean) => void;
const ouvintes = new Set<Ouvinte>();

export function definirAlvo(alvo: AlvoCena) {
  const antes = sinal.ativo;
  sinal.alvo = alvo;
  sinal.ativo = alvo.opacidade > 0;
  if (sinal.ativo !== antes) ouvintes.forEach((fn) => fn(sinal.ativo));
}

/**
 * Avisa quando o crachá passa a ser (ou deixa de ser) reivindicado por
 * algum ato. Serve pra desligar o frameloop do R3F quando a cena não está
 * em cena, GPU parada é bateria economizada.
 */
export function aoMudarAtividade(fn: Ouvinte) {
  ouvintes.add(fn);
  return () => {
    ouvintes.delete(fn);
  };
}
