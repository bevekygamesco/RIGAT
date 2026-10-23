'use strict';
(() => {
 const stage=document.getElementById('recapStage'),canvas=document.getElementById('recapCanvas'),ctx=canvas.getContext('2d');
 const snapshot=document.createElement('canvas');snapshot.width=snapshot.height=1000;
 let ready=false;
 function paint(){if(!ready||document.getElementById('recapStep').hidden)return;const size=Math.max(1,Math.round(stage.clientWidth*Math.min(devicePixelRatio||1,2)));canvas.width=canvas.height=size;ctx.imageSmoothingQuality='high';ctx.drawImage(snapshot,0,0,size,size)}
 function prepare(){
  reset();const offset=finishOffset(),c=snapshot.getContext('2d');c.clearRect(0,0,1000,1000);c.drawImage(composite,offset[0],offset[1],1000,1000);ready=true;
  canvas.setAttribute('aria-label',document.getElementById('model').getAttribute('aria-label'));
  const state=window.shutterConfigurator.getState(),details=document.getElementById('recapDetails');details.replaceChildren();
  function item(label,value,hex){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');row.className='recap-item';dt.textContent=label;if(hex){const dot=document.createElement('span');dot.className='recap-dot';dot.style.backgroundColor=hex;dot.setAttribute('aria-hidden','true');dd.append(dot)}dd.append(document.createTextNode(value));row.append(dt,dd);details.append(row)}
  item('Largeur',state.measurements.widthMm+' mm');item('Hauteur',state.measurements.heightMm+' mm');item('Profil du coffre',state.housing==='arrondi'?'Arrondi':'Facetté');
  for(const [id,label] of groups){const color=colors.find(c=>c[0]===state.colors[id]);item(label,color[1]+' · '+color[2],color[3])}
 }
 function reset(){canvas.style.removeProperty('transform')}
 document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('motion-paused',document.hidden));
 new ResizeObserver(paint).observe(stage);window.recapView={prepare,paint,reset};
})();
