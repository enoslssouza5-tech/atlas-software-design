# Prompt-Mestre — Site Institucional Atlas Software & Design

> Como usar: cole este prompt inteiro no Claude Code, **junto com o
> arquivo `atlas-prototype.html`** (o protótipo que já validamos nesta
> conversa). O protótipo NÃO é referência solta — é a especificação de
> comportamento. Todo componente físico/animado nele já foi testado e
> aprovado; o trabalho do Claude Code é organizar isso em um projeto de
> produção real, não reinventar a lógica do zero.

===== BLOCO 0 — DADOS DA ATLAS (já preenchido, não perguntar de novo) =====
NOME_EMPRESA      = "Atlas Software & Design"
SEGMENTO          = "Websites, sistemas e automações — atende qualquer ramo, sem nicho de destaque"
PROPOSTA_VALOR    = "Websites, sistemas e automações sob medida pra sua marca"
SUBHEADLINE       = "A Atlas transforma ideias em experiências digitais completas — unindo design, performance e automação pra marcas que não querem passar despercebidas."
CIDADE_REGIAO     = "Brasil (atendimento remoto, todo o país)"
SOBRE             = "Não fazemos só sites. Construímos a infraestrutura digital que sua marca precisa pra vender, atender e crescer no automático."
TOM               = "Cinematográfico, confiante, direto — sem cara de landing page de infoproduto"

ROTULO_SERVICOS   = "Stack & Ferramentas" (seção das bolinhas, não é grid de cards tradicional)
PROCESSO          = "01 Diagnóstico · 02 Proposta & Escopo · 03 Design · 04 Desenvolvimento · 05 Lançamento & Suporte" (textos completos na seção 5.7)
DEPOIMENTOS       = "não exibir por padrão"
FAQ               = "não exibir" (decisão já tomada pra Atlas)

WHATSAPP          = "(77) 99829-6908"
INSTAGRAM         = "@atlas_software_design"
DOMINIO           = "" # a definir

COR_BG            = "#0a0a0a"
COR_BG_2          = "#111111"
COR_ACENTO_1      = "#ff5e1a" # laranja vibrante, extraído do logo real da Atlas
COR_ACENTO_2      = "#ffb347" # âmbar/dourado, extraído do gradiente do logo
COR_TEXTO         = "#f2f2f2"
COR_MUTED         = "#9a9a9a"
FONTE             = "-apple-system, 'Segoe UI', Inter, sans-serif" (sistema, sem serifada — vibe tech/agência, não luxo clássico)
LOGO              = "círculo preto, anel em gradiente laranja–dourado, letra 'A' estilizada em laranja com traço/swoosh — ver logo oficial no Instagram @atlas_software_design"
===== FIM DO BLOCO 0 =====

## 1. Papel e objetivo

Você é um(a) engenheiro(a) front-end sênior especializado em sites
institucionais cinematográficos, com forte domínio de física de
animação em canvas (verlet integration, colisão de corpos rígidos) e
scroll storytelling (pin de seção, scroll-jacking controlado).

Entregue o site one-page de produção da Atlas Software & Design,
evoluindo o protótipo `atlas-prototype.html` anexo — que já contém
TODOS os componentes especiais funcionando e aprovados pelo cliente.
Seu trabalho é: (a) organizar o código em estrutura de projeto real,
(b) preencher conteúdo definitivo, (c) polir produção (imagens reais,
SEO, acessibilidade, performance), (d) manter 100% da fidelidade de
comportamento dos componentes físicos/animados já validados.

**Não reescreva do zero a física do crachá nem das bolinhas.** Elas já
foram testadas e aprovadas nesta forma exata. Refatore o código (separar
em módulos/arquivos, comentar, otimizar) mas o comportamento visual e a
matemática por trás (verlet integration da corda, colisão elástica
círculo-círculo, colisão com parede circular) devem permanecer
idênticos ao protótipo.

## 2. Stack técnica (obrigatória)

- HTML5 semântico + CSS3 + JavaScript vanilla (ES Modules quando fizer
  sentido para organização, sem framework pesado).
- **Sem bibliotecas externas via CDN para os componentes físicos**
  (crachá e bolinhas). Isso foi decisão deliberada: evita ponto de
  falha de rede/CDN e mantém o bundle leve — os dois componentes já
  rodam com física própria escrita em JS puro no protótipo, mantenha
  assim.
- GSAP é permitido (e bem-vindo) via CDN **apenas** para reforçar
  timelines de entrada e reveals extras que o protótipo ainda faz via
  IntersectionObserver simples — se decidir trocar, implemente com
  fallback: se o script do GSAP falhar ao carregar, o conteúdo deve
  aparecer normalmente (ver §6, robustez).
- Organize em múltiplos arquivos na entrega final de produção
  (`index.html`, `styles.css`, `main.js` ou módulos por componente:
  `rope-physics.js`, `ball-pit.js`, `scroll-pin.js`, `cursor.js`, etc.),
  diferente do protótipo (que é um único arquivo por conveniência de
  teste rápido).

## 3. Estrutura e ordem das seções (fixa, já validada)

1. **Preloader** — ícones (`</>` websites, `⌘` sistemas, `⚡`
   automações) entrando em stagger, texto "Bem-vindo à Atlas",
   subtexto "websites · sistemas · automações", contador de 0% a 100%
   sincronizado com o carregamento real dos assets (não um timer
   artificial em produção — usar `window.onload` / progresso real de
   fetch dos assets pesados).
2. **Nav fixa** — logo "ATLAS" + âncoras (Sobre, Projetos, Processo,
   Stack, Contato), fundo com blur ao rolar.
3. **Hero** — **dois crachás** lado a lado (um para cada sócio, ver
   §5.4), com corda física, centralizados no topo; headline e subtexto
   abaixo, centralizados (não lado a lado com os crachás — já testamos
   e a headline ficava competindo visualmente).
4. **Sobre** — texto de posicionamento (ver Bloco 0, campo SOBRE).
5. **Projetos** — seção com pin-scroll: a seção gruda na tela
   (`position: sticky`) enquanto o scroll vertical do usuário empurra
   o carrossel de cards (mockup notebook + celular lado a lado) na
   horizontal. Só quando o último projeto passa é que a página volta a
   descer normalmente. Cards gerados a partir de um array de dados
   (`PROJETOS`), nunca hard-coded um por um — ver §5.5.
6. **Processo** — linha **vertical** com 5 etapas numeradas (01–05),
   uma barra de progresso que preenche de cima para baixo conforme o
   scroll passa pela seção, e cada número "acende" (troca de cor)
   quando a barra alcança ele. Ver textos completos em §5.7.
7. **Stack/Ferramentas** — bolinhas com física de colisão, dentro de um
   **pote circular** (visual de globo de sorteio/mega-sena, com vidro e
   base), arrastáveis com o mouse/touch.
8. **CTA final** — "Bora tirar sua ideia do papel", botão magnético
   levando ao WhatsApp `(77) 99829-6908`.
9. **Footer** — © Atlas Software & Design, links de Instagram
   (@atlas_software_design) e WhatsApp.

Camadas globais (não são seções, ficam fixas sobre tudo):
- Cursor customizado (bolha com delay, cresce sobre links/cards)
- Grain/ruído sutil sobre a tela inteira

## 4. Identidade visual (tokens — usar exatamente estes)

```css
:root{
  --bg:#0a0a0a; --bg-2:#111111; --bg-3:#0d0d0d;
  --accent:#ff5e1a; --accent-2:#ffb347;
  --text:#f2f2f2; --muted:#9a9a9a;
}
```
Paleta extraída do logo real da Atlas (círculo preto, anel em
gradiente laranja–dourado, "A" estilizado em laranja). Gradiente de
destaque em textos-chave e no círculo de foto do crachá:
`linear-gradient(140deg, var(--accent), var(--accent-2))` — não usar
mais azul/teal, essa era só uma paleta placeholder do protótipo inicial
antes de termos a marca real.

Gradiente de destaque em textos-chave: `linear-gradient(120deg, var(--accent), var(--accent-2))`
aplicado via `background-clip:text`. Fonte do sistema
(`-apple-system, 'Segoe UI', Inter, sans-serif`) — não trocar por
serifada, a Atlas é posicionada como agência tech, não luxo clássico.

## 5. Componentes especiais (especificação exata — ver protótipo anexo)

### 5.1 Preloader
Ícones em stagger (delay 0.1s / 0.3s / 0.5s), texto de boas-vindas com
fade-in, contador de porcentagem, fade-out completo revelando o
conteúdo principal (`#main.show`). Em produção: ligar o progresso do
contador ao carregamento real (Promise.all de imagens/fonts), não a um
`setInterval` artificial como no protótipo (que era só pra
demonstração).

### 5.2 Cursor customizado
Bolha de 22px seguindo o mouse com lerp (`cx += (mx-cx)*0.18`), cresce
para 52px com leve preenchimento translúcido ao passar sobre links,
botões, cards de projeto e o crachá (`mix-blend-mode:difference`).
Em touch/mobile, desativar completamente (cursor customizado não faz
sentido sem mouse) — o protótipo não trata isso, adicionar:
`if (matchMedia('(pointer: coarse)').matches) { /* não inicializar cursor customizado, manter cursor padrão */ }`.

### 5.3 Grain overlay
Canvas fixo cobrindo a tela, gerando ruído aleatório a cada ~90ms,
opacidade baixa (0.05), `mix-blend-mode:overlay`, `pointer-events:none`.
Regenerar em `resize`.

### 5.4 Crachás — corda com física verlet (vanilla), DOIS instanciados
São **dois crachás lado a lado**, um para cada sócio da Atlas:

| Crachá | Nome | Cargo |
|---|---|---|
| 1 | Enos Lira | Sócio Administrador |
| 2 | (nome do sócio — a confirmar) | Diretor Comercial |

A física é implementada como uma **função reutilizável**
(`initBadgeRope(wrapperEl, canvas, card)`) instanciada uma vez por
crachá — não duplicar o código, só instanciar. Sistema de 14 pontos com
verlet integration (gravidade, fricção, constraint de distância fixa
entre pontos, 8 iterações de resolução por frame), primeiro ponto fixo
(pino no topo), último ponto é o crachá, arrastável com mouse/touch
independente por crachá. O card HTML (`.badge-card`) é posicionado via
`transform: translate() rotateZ() rotateY()` seguindo a posição e o
ângulo do último segmento da corda, com tilt 3D baseado na velocidade
lateral. Código de referência completo: função `initBadgeRope` do
protótipo anexo — usar exatamente essa lógica, só trocando nome/cargo
por crachá.

### 5.5 Projetos — pin-scroll horizontal + lista de dados
A seção fica `position: sticky` dentro de um wrapper cuja altura é
calculada via JS (`altura da viewport + largura total dos cards -
largura da viewport`). No scroll, o progresso (`0` a `1`) é calculado a
partir da posição do wrapper e aplicado como `translateX` no
`.proj-track`. **Os projetos vêm de um array `PROJETOS`** (título,
descrição, cores dos pontinhos, gradiente/imagem), e os cards são
gerados via template — nunca duplicar HTML manualmente por projeto.
Em produção: trocar os gradientes placeholder por screenshots reais
dos projetos (usar `background-image` com a screenshot dentro do
`.screen`), mantendo fallback de gradiente via `onerror` se a imagem
não carregar.

### 5.6 Processo — linha vertical numerada progressiva
Lista vertical de 5 etapas, linha de fundo sutil + linha de destaque
que preenche a **altura** (não largura) conforme o scroll avança pela
seção (`fill.style.height = progresso*100 + '%'`), cada número circular
ganha destaque visual (cor de acento) quando o progresso alcança sua
posição relativa (`i / (total-1)`).

Conteúdo definitivo das 5 etapas (usar exatamente este texto, ele foi
escrito pensando em cliente leigo entender o processo):

1. **Diagnóstico** — Entendemos seu negócio, público e objetivo antes
   de qualquer linha de código.
2. **Proposta & Escopo** — Você recebe um plano claro, com prazo e
   investimento definidos.
3. **Design** — Layout e identidade visual aprovados por você antes de
   construirmos.
4. **Desenvolvimento** — Construção do site ou sistema, com
   atualizações periódicas do progresso.
5. **Lançamento & Suporte** — Publicação no ar e acompanhamento após a
   entrega.

### 5.7 Bolinhas — física de colisão num pote circular
Cada "bolinha" representa uma ferramenta/tecnologia usada pela Atlas
(GSAP, JS, CSS3, React, Git, Figma, HTML, Node — ou atualizar pra
stack real se mudar). **Cada bolinha exibe o ícone/logo da ferramenta,
não o nome em texto** — no protótipo isso é feito com ícones vetoriais
desenhados à mão em canvas (função `drawIcon`, sem dependência
externa), uma aproximação estilizada de cada logo. **Em produção,
trocar por SVGs reais das marcas** (ex.: pacote `simple-icons` ou
`devicon`, baixados e auto-hospedados no projeto — não via CDN, pra
manter a regra de zero dependência externa nos componentes físicos) e
desenhá-los no canvas com `drawImage` sobre uma imagem pré-carregada,
mantendo a mesma física de colisão e o pote circular.
Física própria: gravidade, atrito no ar, colisão elástica
círculo-círculo (impulso baseado em massa igual), colisão com a
**parede circular** do pote (não paredes retas — usar a distância ao
centro do pote, refletir a velocidade ao longo da normal radial quando
a bolinha ultrapassa o raio). Desenhar o pote como vidro (gradiente
radial sutil + stroke + arco de brilho) com uma base elíptica embaixo,
estilo globo de sorteio/mega-sena. Arrastável com mouse/touch, com
"arremesso" ao soltar (velocidade calculada pelo delta do mouse nos
últimos frames).

### 5.8 Botão magnético (CTA)
No `mousemove` dentro do botão, deslocar o botão proporcionalmente
(`translate(x*0.35, y*0.35)`) na direção do cursor; resetar para
`translate(0,0)` no `mouseleave`.

## 6. Robustez (obrigatório)

Se optar por adicionar GSAP via CDN para qualquer reforço de animação,
seguir o padrão de failsafe (evita página em branco se o CDN falhar):

```html
<script>document.documentElement.classList.add('js');</script>
<script>
  window.__gsapReady = false;
  setTimeout(function(){ if(!window.__gsapReady) document.documentElement.classList.add('anim-failed'); }, 3000);
</script>
```
```css
.js .reveal{ opacity:0; transform:translateY(24px); }
.anim-failed .reveal{ opacity:1 !important; transform:none !important; }
@media (prefers-reduced-motion: reduce){
  *{ animation-duration:.001ms !important; transition-duration:.001ms !important; }
  /* desativar crachá e bolinhas ficarem em movimento contínuo por gravidade
     ao repouso não é necessário pausar, mas respeitar a preferência nas
     transições de reveal/CSS */
}
```
O sistema de reveal atual do protótipo (IntersectionObserver + classe
`.visible`) já é robusto por padrão (não depende de CDN) — se não for
trocar por GSAP, não precisa desse failsafe extra, só o
`prefers-reduced-motion`.

## 7. Responsividade (mobile-first)

- Breakpoints: 480 / 768 / 1024px.
- Cursor customizado desativado em touch (ver §5.2).
- Crachá e bolinhas: testar performance em aparelho mid-range —
  ambos já foram desenhados pra rodar em canvas 2D simples (sem
  WebGL), então o custo é baixo, mas limitar o número de bolinhas
  simultâneas se necessário (~8 é o testado).
- Pin-scroll de projetos: em telas muito pequenas, considerar reduzir
  o `scrollDistance` calculado ou usar cards mais estreitos para não
  exigir scroll excessivo.
- Processo: layout vertical já é naturalmente mobile-friendly, não
  precisa de breakpoint especial.
- Sem scroll horizontal indesejado em nenhuma seção fora do pin-scroll
  intencional de projetos.

## 8. SEO, performance e acessibilidade

- `<html lang="pt-br">`, `<title>` e meta description com "Atlas
  Software & Design" + posicionamento (websites, sistemas e
  automações) + "Brasil".
- Open Graph + Twitter Card + canonical.
- `alt` em todas as imagens reais de projeto; lazy-loading
  (`loading="lazy"`) nas imagens abaixo da dobra.
- Contraste AA para texto sobre `--bg` e `--bg-2`.
- `:focus-visible` visível em todos os elementos interativos (o cursor
  customizado não deve remover o outline de foco do teclado).
- `prefers-reduced-motion` respeitado (ver §6).
- Sem LocalStorage/SessionStorage em nenhum componente.

## 9. Entregável e critérios de aceite

Projeto completo (múltiplos arquivos, não um único HTML de protótipo),
pronto para deploy na Vercel. Checklist antes de considerar pronto:

- [ ] Ordem das seções exatamente como o §3
- [ ] Dois crachás (Enos Lira/Sócio Administrador e sócio/Diretor Comercial) com física idêntica ao protótipo (corda verlet, arrastáveis independentemente)
- [ ] Bolinhas com ícone/logo real de cada ferramenta (não texto), dentro do pote circular, física de colisão idêntica ao protótipo
- [ ] Paleta de cores fiel à marca real (preto + laranja/dourado do logo), não a paleta azul/teal do protótipo inicial
- [ ] Projetos com pin-scroll funcionando (testar em mouse, trackpad e touch)
- [ ] Projetos gerados a partir do array `PROJETOS` (fácil adicionar novo item)
- [ ] Processo em linha vertical com preenchimento progressivo e os 5 textos exatos do §5.6
- [ ] Cursor customizado desativado em touch
- [ ] Grain overlay ativo e leve
- [ ] Botão magnético no CTA
- [ ] Preloader com progresso real de carregamento (não timer artificial)
- [ ] Copy 100% em português brasileiro, com acentuação correta
- [ ] Sem FAQ, sem depoimentos (decisão já tomada pra Atlas)
- [ ] Responsivo, sem scroll horizontal indesejado
- [ ] Meta tags, OG, canonical presentes
- [ ] `prefers-reduced-motion` respeitado
- [ ] Nenhuma dependência externa nos componentes físicos (crachá e bolinhas)

## 10. Como proceder

Comece confirmando que leu e entendeu o `atlas-prototype.html` anexo.
Depois, organize a estrutura de arquivos do projeto, migre os
componentes mantendo o comportamento idêntico, e só então avance para
polimento de produção (imagens reais, meta tags, deploy). Se qualquer
instrução deste prompt parecer conflitar com o comportamento já
validado no protótipo anexo, **o protótipo prevalece** — pergunte antes
de divergir dele.
