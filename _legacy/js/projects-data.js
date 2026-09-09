// Pra adicionar um projeto novo, só inclui um objeto aqui — o card é
// gerado automaticamente (ver projects-scroll.js), sem duplicar HTML.
// `imagem` fica pronta pra receber o caminho de um screenshot real
// (ex.: 'assets/projects/rentalfort.jpg'); enquanto não houver imagem,
// o gradiente abaixo funciona como mockup e como fallback caso a
// imagem falhe ao carregar.
export const PROJETOS = [
  { titulo:'RentalFort', desc:'Catálogo de locação de equipamentos', cores:['#f0db4f','#61dafb','#88ce02'], gradiente:'linear-gradient(135deg,#ff5e1a,#1a1a1e)', imagem:null },
  { titulo:'Nakaya', desc:'Restaurante japonês premium', cores:['#e34c26','#2965f1','#a259ff'], gradiente:'linear-gradient(135deg,#ffb347,#0d1b2a)', imagem:null },
  { titulo:'Lira & Souza', desc:'Advocacia criminal — geração de leads', cores:['#f34f29','#3c873a','#f0db4f'], gradiente:'linear-gradient(135deg,#a259ff,#241b3d)', imagem:null },
  { titulo:'Cafeteria Rigno', desc:'Site institucional premium', cores:['#88ce02','#f0db4f','#5b6cff'], gradiente:'linear-gradient(135deg,#ff5e1a,#1a1a1e)', imagem:null },
];
