# Regras do Projeto — Atlas Software & Design

Landing page institucional one-page, hipercinematográfica, com camada 3D.
Assinatura de curta-metragem: a página tem atos, cada ato tem sua respiração,
o scroll é movimento de câmera dirigida. Silêncio antes do movimento faz parte
do design. O motion É o design, não um efeito por cima.

---

## Stack (obrigatória)

- Next.js 15, App Router, TypeScript.
- GSAP + `@gsap/react` + ScrollTrigger para todo o motion 2D/timeline.
- Lenis (`@studio-freight/lenis`) para o scroll suave.
- React Three Fiber (`@react-three/fiber`) + `@react-three/drei` para a camada 3D.
- Bolinhas de stack: Canvas 2D vanilla, sem nenhuma lib.

---

## Scroll

Todo scroll usa Lenis. Nunca window scroll nativo.
Lenis inicializa uma única vez, no `layout.tsx`, como Provider.
Lenis alimenta o ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
Nunca usar `window.addEventListener('scroll')` com Lenis ativo.

---

## Animação (GSAP)

Todo movimento de entrada usa GSAP. Nunca CSS transition pra animação de entrada.
Ease padrão, `power3.out`. Loops infinitos usam `sine.inOut`.
Duration mínima de entrada, 0.6s. Exceção, micro interação de hover, abaixo de 0.25s.
`translateY` em entradas, mínimo 28px, máximo 60px.
`staggerChildren` entre 0.08s e 0.12s.
Duration nunca em número redondo tipo 500ms ou 1000ms.
PROIBIDO bounce, elastic, ease in out em qualquer animação de entrada.

---

## Camada 3D

React Three Fiber roda dentro de um único Canvas na seção do Hero.
Cena 3D nunca bloqueia o first paint, lazy load com `next/dynamic`, `ssr: false`.
Sempre fallback, sem WebGL ou conexão lenta abre imagem estática do crachá no lugar da cena.
Orçamento, cerca de 300 mil triângulos e no máximo 3 luzes dinâmicas na cena do crachá.
Em `prefers-reduced-motion`, a cena 3D para de animar mas continua visível estática.
No mobile, reduzir a cena (menos segmentos de geometria, sem física de vaivém do cordão,
luz única), mantendo a mesma composição visual, nunca remover o elemento 3D por completo.

### Crachá — construção procedural

- Corpo: geometria extrudada tipo cartão arredondado (`RoundedBox` ou `ExtrudeGeometry`
  com bordas suaves), `MeshPhysicalMaterial`, metalness 0.3–0.5, roughness baixo pra
  brilho controlado, nunca espelhado.
- Logo: o "A" da Atlas como textura/normal map na face, ou geometria extrudada fina
  sobreposta. Laranja como única cor de destaque.
- Cordão: `TubeGeometry` seguindo uma `CatmullRomCurve3`, com vaivém sutil via `useFrame`
  (oscilação senoidal). Nunca física real de corda.
- Luz: uma principal quente em laranja suave e uma de preenchimento fria, contra fundo
  quase preto. Clima de luxo silencioso.

---

## Canvas 2D vanilla (bolinhas de stack)

Roda isolado, sem depender de nenhuma lib além do Canvas API nativo.
`requestAnimationFrame` com controle de FPS (cap em 60fps), pausa quando a seção sai
da viewport (`IntersectionObserver`).
Cada bolinha representa uma tecnologia/ferramenta (ícone ou sigla), com física simples
de colisão dentro do contorno do pote (gravidade leve, quicar amortecido), reagindo a
mouse/touch. No mobile, menos bolinhas simultâneas pra manter FPS estável.

Física portada de `_legacy/js/ball-pit.js` (colisão círculo-círculo com impulso, parede
circular, 3 iterações de resolução, drag com velocidade herdada). O que muda na porta:

- Delta-time fixo com cap de 60fps. Nunca gravidade acoplada ao refresh rate.
- `devicePixelRatio` no dimensionamento do canvas. Nunca `canvas.width = clientWidth` puro.
- Raio da bolinha proporcional ao raio do pote, nunca px fixo.
- Brilho do vidro dirigido por ScrollTrigger com scrub, nunca por listener de scroll.
- Pausa via `IntersectionObserver` e cleanup de todos os listeners no unmount.
- Sem `ctx.filter = 'blur()'` (falha silenciosa em Safari antigo). Usar gradiente radial.
- Em `prefers-reduced-motion`, renderiza um frame único com as bolinhas assentadas.

### Stack da Atlas (lista fechada)

Desktop, 13 bolinhas. Mobile, as 8 primeiras.

`Next.js` · `TypeScript` · `React` · `Node.js` · `Supabase` · `n8n` · `GSAP`
· `Vercel` · `JavaScript` · `HTML5` · `CSS3` · `Git` · `Figma`

Ícones SVG auto-hospedados em `public/icons/`, com fallback desenhado em canvas se
algum falhar. Nenhuma ferramenta entra nessa lista sem ser de uso real da Atlas.

---

## Componentes

Um componente é um `.tsx` mais um `.module.css`.
Sem Tailwind inline pra estilos de motion.
Todo componente com GSAP usa `useGSAP` do `@gsap/react`, com cleanup no return.

---

## O que nunca fazer

- Bounce ou elastic em qualquer animação.
- Ease in out em entrada.
- Cena 3D sem fallback de performance.
- Dois sistemas de scroll rodando ao mesmo tempo.
- Modelo 3D importado de arquivo externo (GLB/glTF), tudo aqui é procedural.

---

## Identidade visual

Vem da marca real da Atlas (logo fornecido pelo cliente) e da referência ORYZO AI /
Lusion aprovada em briefing. Nunca substituir por outra suposição estética.

```css
:root{
  --preto: #0A0A0A;
  --preto-2: #131313;
  --preto-3: #1C1C1F;
  --branco: #F7F5EF;
  --cinza: #8A8A92;
  --cinza-2: #4A4A52;

  --acento: #F2790C;
  --acento-claro: #FFA347;
  --acento-escuro: #B85600;

  --font-display: "General Sans", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;

  --ease-cine: cubic-bezier(0.16, 1, 0.3, 1);
}
```

O hex do laranja é estimativa extraída visualmente do logo. Ajustar pra bater com o
vetorial original assim que disponível.

Composição: fundo predominantemente `--preto`, com o branco cru como respiro em 1 a 2
momentos-chave da jornada (nunca alternância mecânica seção a seção). Overlay escuro
`rgba(0,0,0,0.5)`–`0.6` sobre qualquer vídeo/imagem de fundo. Tipografia grande com
`clamp()`, nunca px fixo. Filetes finos em laranja como único elemento decorativo de
linha. O laranja nunca ocupa grandes áreas sólidas: é sempre acento, nunca fundo.

---

## Copy e conformidade

Copy em português do Brasil, com acentuação correta.
Especificidade anti-genérica: nenhuma frase pode servir pra qualquer outra agência
do mesmo segmento.
Proibido inventar métrica, nome de cliente, prazo ou case. Enquanto o dado real não
chegar, usar placeholder visível no formato `[PLACEHOLDER · descrição do que falta]`.
Proibida propaganda enganosa ou abusiva. Nada de resultado garantido ou impossível.
Depoimentos só reais e com consentimento — por padrão, nenhum.
Mockups de projeto sempre marcados como fictícios de demonstração.

---

## Estrutura narrativa (preloader + 9 atos)

0. **Preloader** — logo com stroke-dasharray, máx. 2.5s, pula via `sessionStorage`, nunca bloqueia além de 3s.
1. **Abertura (Hero)** — 100svh, cena 3D do crachá, reação ao mouse máx. 8–10°, headline palavra por palavra. Silêncio de 0.4s antes de qualquer animação.
2. **A dor** — só tipografia, fundo escuro, sem imagem.
3. **Revelação da solução** — ScrollTrigger `pin: true`, `scrub: 1.2`, `height: 300vh`, sticky 100vh, blocos em sequência com 0.2s de diferença.
4. **Benefícios** — grid, ícones em traço fino laranja, sem área sólida.
5. **Projetos** — carrossel horizontal, mockup duplo (notebook + celular), parallax.
6. **Prova social** — banda com parallax, contadores GSAP (1.5–1.8s) quando houver dado real.
7. **Stack/ferramentas** — pote com bolinhas em Canvas 2D vanilla.
8. **Oferta, objeções e FAQ** — accordion com altura animada via GSAP, nunca `max-height` CSS abrupto.
9. **Convite (CTA final)** — crachá 3D em destaque, um único CTA, microcopy de redução de risco.

---

## Robustez, acessibilidade e SEO

Failsafe no `<head>`: classe `anime-failed` após 3s sem inicializar.
`prefers-reduced-motion` respeitado em 100% das animações, incluindo a cena 3D e o canvas.
Mobile first (480/768/1024/1280px), 360px a 1440px+, mesma estrutura narrativa em todos
os tamanhos. Áreas de toque mínimo 44x44px.
`lang="pt-BR"`, title/description com Atlas Software & Design + segmento + região,
OG/Twitter Card, canonical, JSON-LD `Organization`/`ProfessionalService`.
WCAG AA. Lighthouse mobile acima de 75 mesmo com 3D ativo.
Formulário de contato, se houver: checkbox de consentimento e link pra política de privacidade.
Imagens ausentes: `onerror` com fallback em gradiente laranja/preto.

---

## Legado

A versão anterior do site (Vite + vanilla + `three` + `animejs`) está em `_legacy/`,
fora do build. Serve como referência visual e de física. Ver `_legacy/README.md`.

`_legacy/Models/id_card_model/` é um glTF de terceiro sob CC-BY-4.0, que exigiria
crédito visível ao autor. Não entra no projeto novo em hipótese alguma: o crachá é
100% procedural.

---

## Armadilhas já pagas

Cada item abaixo custou uma sessão de depuração neste projeto. Nenhum é
teoria: todos foram medidos com o navegador aberto e corrigidos no código.

### ScrollTrigger recalcula na ordem de CRIAÇÃO, não na ordem da página

O pin do Ato 5 nasce depois do device tier resolver — ou seja, depois dos
gatilhos dos atos 6 a 9. Sem `refreshPriority`, esses atos se mediam antes de
o espaçador do pin existir e ficavam **1792px adiantados**: o crachá do Ato 9
reaparecia no meio do Ato 8 e sumia no clímax.

Regra: **todo ScrollTrigger com `pin` declara `refreshPriority`**, maior para
quem vem antes na página. Hoje: Ato 3 = 2, Ato 5 = 1, o resto = 0.

`ScrollTrigger.refresh()` NÃO conserta isso depois — foi verificado, inclusive
com `refresh(true)`.

### `refresh()` chamado dentro da criação de um pin é descartado

O guard de reentrância do ScrollTrigger engole a chamada em silêncio. Se
precisar de um refresh logo após criar um pin, jogue pro próximo quadro com
`requestAnimationFrame`.

### `ScrollTrigger.kill()` sem `revert` deixa o espaçador do pin no DOM

Em dev, com o StrictMode montando duas vezes, cada remontagem empilhava mais um
espaçador: a página crescia sozinha e todos os gatilhos saíam do lugar.
Não escreva cleanup manual pra animação criada dentro de `useGSAP` — ele já
reverte corretamente.

### `pinSpacing` duplica altura de seção que já foi dimensionada no CSS

O Ato 3 mede 300vh no CSS (100vh de palco + 200vh de curso). Com o
`pinSpacing` padrão, o ScrollTrigger reservava mais 200vh e abria um vazio
depois da seção. Seção pré-dimensionada usa `pinSpacing: false`.

### Seção com fundo opaco esconde o Canvas 3D

O Canvas é `position: fixed` em `z-index: 1`; as seções vivem em `z-index: 2`.
Todo ato que precisa mostrar o crachá tem `background: transparent` e herda o
preto do `<body>`. Pintar `--preto` na seção apaga a cena sem erro nenhum no
console.

### O failsafe é desarmado quando o motion sobe, não quando o preloader acaba

Com o desarme no fim do preloader, a corrida contra os 3s era apertada demais:
qualquer hidratação lenta acendia `anime-failed` numa página saudável — e a
lista textual do pote, que só deveria aparecer em emergência, vazava por cima
do canvas. Quem desarma é o `LenisProvider`, assim que Lenis e GSAP estão de pé.

### Espaço entre palavras fica FORA da máscara

No `SplitWords`, um espaço dentro de um `inline-block` com `overflow: hidden` é
engolido e as palavras saem coladas ("sistemase automações"). O espaço vai
entre as máscaras, num `Fragment`.

### Sonda de desenvolvimento

`window.__atlasCena` (alvo e estado interpolado da cena) e `window.__ST`
(o ScrollTrigger) existem só fora de produção. Nada do caminho de animação
passa por render do React, então sem essas duas sondas depurar a cena 3D vira
adivinhação.

### `gsap.set` de estado inicial precisa mirar EXATAMENTE o que a timeline anima

No Ato 1, o fallback `if (!liberado) { gsap.set([...], {opacity:0}) }` escondia
o contêiner `.acoes` inteiro, mas a timeline de entrada só reanima os FILHOS
(`.acoes > *`), nunca o contêiner. Resultado: `.acoes` ficava com
`style="opacity: 0"` travado pra sempre, e os dois botões da CTA principal
(`getComputedStyle` reportando opacity:1 em cada um, DOM correto, sem erro
nenhum no console) simplesmente não apareciam, porque a opacidade do pai
composita visualmente por cima da opacidade do filho.

`getComputedStyle` de um elemento só reporta a opacidade DELE, não a
opacidade efetiva renderizada (que é o produto de toda a cadeia de
ancestrais). Testar visibilidade só pelo computed style do próprio elemento
engana; é preciso checar a cadeia de pais, ou simplesmente confirmar por
screenshot real.

Regra: a lista de seletores escondida no estado inicial (`gsap.set(...,
{opacity:0})`) tem que ser IDÊNTICA à lista de seletores que a timeline de
entrada revela depois. Nunca esconder o contêiner se quem anima de volta são
só os filhos.

