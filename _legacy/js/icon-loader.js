// Carrega SVGs reais das ferramentas (auto-hospedados em assets/icons/,
// zero CDN em runtime), recolore via injeção do atributo fill e devolve
// como HTMLImageElement pronto pra canvas.drawImage. Se um ícone falhar,
// devolve null — quem consome decide o fallback (ícone desenhado à mão).
async function loadOneIcon(path, colorHex){
  try{
    const res = await fetch(path);
    if(!res.ok) throw new Error(`falha ao buscar ${path}`);
    let svgText = await res.text();
    svgText = svgText.replace('<svg ', `<svg fill="${colorHex}" `);
    const blob = new Blob([svgText], { type:'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    const loaded = new Promise((resolve, reject)=>{
      img.onload = ()=>resolve(img);
      img.onerror = reject;
    });
    img.src = url;
    return await loaded;
  } catch(err){
    return null;
  }
}

export async function loadToolIcons(tools){
  const map = new Map();
  await Promise.all(tools.map(async t=>{
    const img = await loadOneIcon(t.iconPath, t.iconColor);
    map.set(t.label, img);
  }));
  return map;
}
