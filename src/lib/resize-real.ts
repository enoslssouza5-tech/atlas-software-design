/**
 * Filtra resize disparado só pelo recolhimento da barra de endereço do
 * navegador mobile: ela muda a altura da janela sem mudar a largura, e por
 * uma margem bem menor que 150px (toda barra de endereço conhecida fica
 * abaixo disso; uma rotação de tela de verdade muda a largura também, ou
 * muda a altura em centenas de pixels, não dezenas).
 *
 * No desktop todo resize é considerado real, sem essa checagem.
 */
export function criarFiltroResizeReal(mobile: boolean, limiteAltura = 150) {
  let larguraAnterior = window.innerWidth;
  let alturaAnterior = window.innerHeight;

  return () => {
    const larguraAtual = window.innerWidth;
    const alturaAtual = window.innerHeight;
    const mudouLargura = larguraAtual !== larguraAnterior;
    const mudouAlturaMuito = Math.abs(alturaAtual - alturaAnterior) > limiteAltura;
    const real = !mobile || mudouLargura || mudouAlturaMuito;
    larguraAnterior = larguraAtual;
    alturaAnterior = alturaAtual;
    return real;
  };
}
