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
 * Em telas largas o crachá divide a tela com o texto. Em telas estreitas não
 * existe coluna livre: ele desce pro rodapé da cena, menor e mais discreto,
 * atrás do conteúdo. A composição é a mesma, o objeto continua presente nos
 * mesmos três atos, só muda a escala e o lugar que sobra.
 */
export const CENAS = {
  /** Ato 1: crachá em destaque, à direita do texto */
  hero: { x: 1.05, y: -0.1, escala: 1, opacidade: 1 } as AlvoCena,
  heroMobile: { x: 0.26, y: -0.95, escala: 0.5, opacidade: 0.9 } as AlvoCena,

  /**
   * Ato 3: miniatura no canto inferior direito, assinatura visual recorrente.
   *
   * Atenção ao limite do frustum: com fov 34 e câmera em z 6.2, a meia-altura
   * visível é ~1.9 e a meia-largura é 1.9 × aspecto (≈3.03 em 16:9). x 3.35
   * jogava o crachá pra fora da tela sem erro nenhum, ele simplesmente não
   * aparecia.
   */
  miniatura: { x: 2.62, y: -1.45, escala: 0.32, opacidade: 0.85 } as AlvoCena,
  miniaturaMobile: { x: 0.58, y: -1.34, escala: 0.22, opacidade: 0.8 } as AlvoCena,

  /**
   * Ato 9: clímax. Espelho do Ato 1: lá o crachá estava à direita do texto,
   * aqui ele está à esquerda. A página fecha com a mesma imagem invertida.
   */
  convite: { x: -1.55, y: -0.05, escala: 1.05, opacidade: 1 } as AlvoCena,
  conviteMobile: { x: 0.06, y: -1, escala: 0.55, opacidade: 0.85 } as AlvoCena,

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
