export type Ferramenta = {
  rotulo: string;
  /** cor da bolinha */
  cor: string;
  /** SVG auto-hospedado; quando ausente, o glifo é desenhado no canvas */
  icone?: string;
  /** true quando o ícone precisa de traço escuro sobre bolinha clara */
  claro?: boolean;
};

/**
 * Stack da Atlas — lista fechada no CLAUDE.md.
 *
 * A ordem importa: as 8 primeiras são as que diferenciam o trabalho e são
 * exatamente as que sobrevivem no corte do mobile. Nenhuma ferramenta entra
 * aqui sem ser de uso real.
 */
export const FERRAMENTAS: Ferramenta[] = [
  { rotulo: 'Next.js', cor: '#F7F5EF', claro: true },
  { rotulo: 'TypeScript', cor: '#3178c6' },
  { rotulo: 'React', cor: '#61dafb', icone: '/icons/react.svg', claro: true },
  { rotulo: 'Node.js', cor: '#3c873a', icone: '/icons/nodedotjs.svg' },
  { rotulo: 'Supabase', cor: '#3ecf8e', claro: true },
  { rotulo: 'n8n', cor: '#ea4b71' },
  { rotulo: 'GSAP', cor: '#88ce02', icone: '/icons/gsap.svg', claro: true },
  { rotulo: 'Vercel', cor: '#1C1C1F' },
  { rotulo: 'JavaScript', cor: '#f0db4f', icone: '/icons/javascript.svg', claro: true },
  { rotulo: 'HTML5', cor: '#e34c26', icone: '/icons/html5.svg' },
  { rotulo: 'CSS3', cor: '#2965f1', icone: '/icons/css3.svg' },
  { rotulo: 'Git', cor: '#f34f29', icone: '/icons/git.svg' },
  { rotulo: 'Figma', cor: '#a259ff', icone: '/icons/figma.svg' },
];

/** No mobile só as 8 primeiras entram no pote, pra o FPS não cair. */
export const LIMITE_MOBILE = 8;
