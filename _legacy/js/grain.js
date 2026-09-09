// Overlay de ruído/grain sutil sobre toda a tela.
export function initGrain(canvas){
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function draw(){
    const w = canvas.width, h = canvas.height;
    const imgData = ctx.createImageData(w, h);
    const buf = imgData.data;
    for(let i=0;i<buf.length;i+=4){
      const v = Math.random()*255;
      buf[i]=v; buf[i+1]=v; buf[i+2]=v; buf[i+3]=255;
    }
    ctx.putImageData(imgData,0,0);
  }
  setInterval(draw, 90);
}
