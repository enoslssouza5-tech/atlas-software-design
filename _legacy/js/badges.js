import { initBadgeRope } from './rope-physics.js';

// Dados dos sócios — gerar os crachás a partir daqui, nunca duplicar HTML.
export const SOCIOS = [
  { id:1, nome:'Enos Lira', cargo:'Sócio Administrador', inicial:'E' },
  { id:2, nome:'Lucas Britto', cargo:'Diretor Comercial', inicial:'L' },
];

export function renderBadges(containerEl){
  containerEl.innerHTML = SOCIOS.map(s => `
    <div class="hero-badge">
      <canvas class="rope-canvas" id="rope-canvas-${s.id}"></canvas>
      <div class="badge-card" id="badge-card-${s.id}">
        <div class="photo">${s.inicial}</div>
        <div class="name">${s.nome}</div>
        <div class="role">${s.cargo.toUpperCase()}</div>
        <div class="barcode"></div>
      </div>
    </div>
  `).join('');

  containerEl.querySelectorAll('.hero-badge').forEach(wrapper=>{
    const canvas = wrapper.querySelector('.rope-canvas');
    const card = wrapper.querySelector('.badge-card');
    initBadgeRope(wrapper, canvas, card);
  });
}
