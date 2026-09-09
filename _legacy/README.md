# _legacy — versão anterior do site da Atlas

Stack antigo: Vite + JavaScript vanilla + `three` (GLTFLoader) + `animejs`.
Arquivado em 08/09/2026, substituído pela reescrita em Next.js 15 na raiz.

**Nada aqui entra no build novo.** Serve só como referência visual e de física.

## O que vale consultar

- `js/ball-pit.js` — física das bolinhas (colisão círculo-círculo com impulso,
  parede circular, drag com velocidade herdada). É a base portada pro Canvas 2D novo.
- `js/hero-scene.js` — composição e caimento do crachá. Referência de proporção
  pro `BadgeCard` procedural.
- `js/rope-physics.js` — comportamento do cordão.
- `assets/icons/` — SVGs de ferramentas auto-hospedados.
- `source/atlas-prototype.html` — protótipo aprovado original.

## Atenção — licença

`Models/id_card_model/` é o modelo "ID Card Model" de Johana-PS (Sketchfab),
licenciado CC-BY-4.0: exige crédito visível ao autor em qualquer publicação.
Por isso ele **não** é usado na versão nova — o crachá é 100% procedural.
Ver `Models/id_card_model/license.txt`.
