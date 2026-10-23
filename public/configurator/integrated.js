/* Original supplied image compositor and measurement engine. No iframe or WebGL. */
window.initializeRigatConfigurator=function(root){
if(root.dataset.initialized)return;root.dataset.initialized='true';
window.shutterViewOffsets={"motion":{"closed":[[58.5,-10.0],[58.5,-9.0],[58.0,-8.5],[56.0,-8.0],[54.0,-8.0],[51.0,-7.0],[48.5,-6.5],[46.5,-6.5],[43.5,-6.0],[41.5,-6.0],[39.5,-6.0],[37.5,-5.5],[35.5,-5.5],[34.5,-5.0],[33.0,-5.5],[32.0,-5.0],[31.5,-5.0],[31.5,-6.0],[33.0,-6.0],[34.5,-6.5],[37.5,-7.5],[41.5,-8.5],[47.0,-10.0],[72.5,-11.0],[79.0,-11.0],[84.0,-11.0],[87.0,-11.0],[88.5,-11.5],[88.0,-11.5],[85.0,-12.0],[80.0,-13.0],[73.5,-14.0],[65.0,-14.5],[61.0,-15.5],[58.5,-16.5],[56.0,-15.5],[49.5,-15.0],[40.5,-14.0],[33.0,-13.0],[28.0,-12.5],[25.0,-12.0],[24.5,-11.0],[27.5,-10.5],[32.0,-10.5],[38.5,-10.5],[65.5,-10.5],[72.5,-9.0],[78.0,-7.5],[81.5,-6.0],[83.5,-6.0],[83.0,-5.5],[82.0,-5.0],[79.0,-5.0],[76.0,-5.5],[72.0,-6.0],[67.5,-6.5],[63.0,-7.5],[59.5,-8.0],[59.0,-8.5],[59.0,-9.0]],"open":[[58.5,-9.5],[58.5,-9.0],[58.0,-8.5],[56.0,-8.0],[54.0,-8.0],[51.0,-7.0],[48.5,-6.5],[46.5,-6.5],[43.5,-6.0],[41.5,-6.0],[39.5,-6.0],[37.5,-5.5],[35.5,-5.5],[34.5,-5.0],[33.0,-5.5],[32.0,-5.0],[31.5,-5.0],[31.5,-6.0],[33.0,-6.0],[34.5,-6.5],[37.5,-7.5],[41.5,-8.5],[47.0,-10.0],[72.5,-11.0],[79.0,-11.0],[84.0,-11.0],[87.0,-11.0],[88.5,-11.5],[88.0,-11.5],[85.0,-12.0],[80.0,-13.0],[73.5,-14.0],[65.0,-14.5],[61.0,-15.5],[58.5,-16.5],[56.0,-15.5],[49.5,-15.0],[40.5,-14.0],[33.0,-13.0],[28.0,-12.5],[25.0,-12.0],[24.5,-11.0],[27.5,-10.5],[32.0,-10.5],[38.5,-10.5],[65.5,-10.5],[72.5,-9.0],[78.0,-7.5],[81.5,-6.0],[83.5,-6.0],[83.0,-5.5],[82.0,-5.0],[79.0,-5.0],[76.0,-5.5],[72.0,-6.0],[67.5,-6.5],[63.0,-7.5],[59.5,-8.0],[59.0,-8.5],[59.0,-9.0]],"opening":[[58.5,-10.0],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5],[58.5,-9.5]]},"finish":{"8-44/facette":[34.5,-5.0],"8-44/arrondi":[34.5,-9.5]}};

'use strict';
const colors=[['acier-reference','Acier','Métallique','#676767'],['blanc-9010','Blanc','RAL 9010','#F0ECE1'],['noir-9005','Noir','RAL 9005','#0A0A0A']];
const groups=[['Tablier-index0','Tablier'],['LameFinale-index1','Lame finale'],['Coulisse-index2','Coulisses'],['Coffre-index3','Couleur du coffre']];
const selected=Object.fromEntries(groups.map(([id])=>[id,'acier-reference']));
const tablierSizes=[['8-44','Standard']];
let tablierSize='8-44';
let housing='facette',ticket=0;
const cache=new Map(),canvas=document.getElementById('model'),context=canvas.getContext('2d'),stage=document.getElementById('stage'),status=document.getElementById('status');
const composite=document.createElement('canvas');composite.width=1000;composite.height=1000;
const compositeContext=composite.getContext('2d');
const labels=new Map(),rows=new Map();
function finishOffset(){return window.shutterViewOffsets?.finish?.[tablierSize+'/'+housing]||[0,0]}
function present(){
 const size=Math.max(1,Math.round(stage.getBoundingClientRect().width*Math.min(window.devicePixelRatio||1,2)));
 if(canvas.width!==size||canvas.height!==size){canvas.width=size;canvas.height=size}
 context.clearRect(0,0,size,size);context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
 const offset=finishOffset();context.drawImage(composite,offset[0]/1000*size,offset[1]/1000*size,size,size);
}
new ResizeObserver(present).observe(stage);
window.addEventListener('resize',present);

const zoomPanel=document.getElementById('zoomPanel'),zoomCanvas=document.getElementById('detailCanvas'),zoomContext=zoomCanvas.getContext('2d'),zoomHint=document.getElementById('zoomHint'),lens=document.getElementById('detailLens');
const detailComposite=document.createElement('canvas');detailComposite.width=1600;detailComposite.height=1600;const detailContext=detailComposite.getContext('2d',{willReadFrequently:true});
const detailCache=new Map();let detailKey='',detailTicket=0,detailReady=false,detailAlpha=null,hovering=false,animation=0,lastTime=0;
const target={x:.5,y:.5},cursor={x:.5,y:.5};
const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
function choiceKey(){return tablierSize+'|'+housing+'|'+groups.map(([g])=>selected[g]).join('|')}
function stopDetail(){hovering=false;zoomPanel.classList.remove('active');stage.classList.remove('is-inspecting');if(animation)cancelAnimationFrame(animation);animation=0;lastTime=0}
function invalidateDetail(){detailTicket++;detailReady=false;detailAlpha=null;detailKey='';stopDetail();zoomHint.innerHTML='Survolez le rideau<br>pour voir les détails'}
function loadDetail(path){
 if(detailCache.has(path)){const existing=detailCache.get(path);detailCache.delete(path);detailCache.set(path,existing);return existing}
 const promise=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>{detailCache.delete(path);reject(new Error('Detail image unavailable'))};image.src=path});detailCache.set(path,promise);return promise;
}
async function ensureDetail(){
 const key=choiceKey();if(detailKey===key)return;
 detailKey=key;detailReady=false;const generation=++detailTicket,style=housing,selection={...selected};zoomHint.textContent='Chargement du détail…';
 try{
  const images=await Promise.all(groups.map(([g])=>loadDetail(`/configurator/images/zoom_layers/${tablierSize}/${style}/${g}/${selection[g]}.png`)));
  if(generation!==detailTicket||key!==choiceKey())return;
  detailContext.clearRect(0,0,1600,1600);detailContext.globalCompositeOperation='lighter';for(const image of images)detailContext.drawImage(image,0,0);detailContext.globalCompositeOperation='source-over';
  try{detailAlpha=detailContext.getImageData(0,0,1600,1600).data}catch(error){detailAlpha=null}detailReady=true;
  while(detailCache.size>8)detailCache.delete(detailCache.keys().next().value);
  zoomHint.innerHTML='Survolez le rideau<br>pour voir les détails';if(hovering)startDetail();
 }catch(error){if(generation!==detailTicket)return;detailKey='';detailReady=false;zoomHint.textContent='Detail images unavailable. Extract the complete ZIP.';stopDetail()}
}
function overModel(x,y){if(!detailAlpha)return x>.20&&x<.76&&y>.10&&y<.90;const px=Math.min(1599,Math.max(0,Math.floor(x*1600))),py=Math.min(1599,Math.max(0,Math.floor(y*1600)));return detailAlpha[(py*1600+px)*4+3]>20}
function drawDetail(){
 const bounds=stage.getBoundingClientRect(),panel=zoomPanel.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),pixels=Math.round(panel.width*dpr);
 if(zoomCanvas.width!==pixels||zoomCanvas.height!==pixels){zoomCanvas.width=pixels;zoomCanvas.height=pixels}
 const crop=Math.min(1600,panel.width/bounds.width/1.5*1600);
 const sx=Math.max(0,Math.min(1600-crop,cursor.x*1600-crop/2)),sy=Math.max(0,Math.min(1600-crop,cursor.y*1600-crop/2));
 zoomContext.clearRect(0,0,pixels,pixels);zoomContext.imageSmoothingEnabled=true;zoomContext.imageSmoothingQuality='high';zoomContext.drawImage(detailComposite,sx,sy,crop,crop,0,0,pixels,pixels);
 const lensSize=crop/1600*bounds.width;lens.style.width=lensSize+'px';lens.style.height=lensSize+'px';lens.style.transform=`translate(${(sx/1600+finishOffset()[0]/1000)*bounds.width}px,${(sy/1600+finishOffset()[1]/1000)*bounds.height}px)`;
}
function tickDetail(time){
 animation=0;if(!hovering||!detailReady)return;
 if(!overModel(target.x,target.y)){zoomPanel.classList.remove('active');stage.classList.remove('is-inspecting');lastTime=0;return}
 const dt=lastTime?Math.min(64,time-lastTime):16;lastTime=time;const ease=reduced.matches?1:1-Math.exp(-dt/38);
 cursor.x+=(target.x-cursor.x)*ease;cursor.y+=(target.y-cursor.y)*ease;drawDetail();zoomPanel.classList.add('active');stage.classList.add('is-inspecting');
 if(Math.abs(target.x-cursor.x)+Math.abs(target.y-cursor.y)>.0001)animation=requestAnimationFrame(tickDetail);else lastTime=0;
}
function startDetail(){if(!detailReady||!hovering||animation)return;animation=requestAnimationFrame(tickDetail)}
function trackDetail(event){
 if(event.pointerType==='touch'&&event.type==='pointermove'&&event.buttons===0)return;
 const b=stage.getBoundingClientRect();target.x=Math.max(0,Math.min(1,(event.clientX-b.left)/b.width-finishOffset()[0]/1000));target.y=Math.max(0,Math.min(1,(event.clientY-b.top)/b.height-finishOffset()[1]/1000));
 if(!hovering){cursor.x=target.x;cursor.y=target.y}hovering=true;ensureDetail();startDetail();
}
stage.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')trackDetail(event)});stage.addEventListener('pointermove',trackDetail);stage.addEventListener('pointerdown',trackDetail);stage.addEventListener('pointerleave',stopDetail);stage.addEventListener('pointercancel',stopDetail);
new ResizeObserver(()=>{if(detailReady&&hovering)drawDetail()}).observe(zoomPanel);
function setTheme(theme){
 root.dataset.theme=theme;
 for(const button of document.querySelectorAll('[data-theme-choice]'))button.setAttribute('aria-pressed',String(button.dataset.themeChoice===theme));
 try{localStorage.setItem('shutter-preview-theme',theme)}catch(error){}
}
for(const button of document.querySelectorAll('[data-theme-choice]'))button.onclick=()=>setTheme(button.dataset.themeChoice);
let initialTheme='light';try{initialTheme=localStorage.getItem('shutter-preview-theme')==='dark'?'dark':'light'}catch(error){}setTheme(initialTheme);

function imagePath(group,color,style=housing){return `/configurator/images/renders_frame13/${tablierSize}/${style}/${group}/${color}.png`}
function loadImage(path){
 if(cache.has(path)){const existing=cache.get(path);cache.delete(path);cache.set(path,existing);return existing}
 cache.set(path,new Promise((resolve,reject)=>{
  const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>{cache.delete(path);reject(new Error(path))};image.src=path;
 }));
 return cache.get(path);
}
async function render(){
 invalidateDetail();
 const thisTicket=++ticket,style=housing,selection={...selected};stage.setAttribute('aria-busy','true');status.textContent='';
 try{
  const images=await Promise.all(groups.map(([group])=>loadImage(imagePath(group,selection[group],style))));
  if(thisTicket!==ticket)return;
  compositeContext.clearRect(0,0,1000,1000);
  // Holdout masks partition visible surfaces. Add premultiplied coverage to avoid dark/bright hairline seams.
  compositeContext.globalCompositeOperation='lighter';
  for(const image of images)compositeContext.drawImage(image,0,0,1000,1000);
  compositeContext.globalCompositeOperation='source-over';present();
  // Bound decoded-image memory while retaining recent shape/color choices.
  while(cache.size>8)cache.delete(cache.keys().next().value);
  canvas.setAttribute('aria-label',`Metal shutter, tablier ${tablierSizes.find(row=>row[0]===tablierSize)[1]}, with ${style==='arrondi'?'rounded':'faceted'} housing. `+groups.map(([g,label])=>`${label}: ${colors.find(c=>c[0]===selection[g]).slice(1,3).join(' ')}`).join('. '));
  stage.setAttribute('aria-busy','false');return true;
 }catch(error){
  if(thisTicket!==ticket)return;
  stage.setAttribute('aria-busy','false');status.textContent='An image is missing. Extract the complete ZIP and keep the images folder beside index.html.';return false;
 }
}
function refreshControls(){
 for(const button of document.querySelectorAll("[data-tablier-size]"))button.setAttribute("aria-pressed",String(button.dataset.tablierSize===tablierSize));
 for(const [group]of groups){const color=colors.find(c=>c[0]===selected[group]);labels.get(group).textContent=`${color[1]} · ${color[2]}`;
  for(const button of rows.get(group).children)button.setAttribute('aria-pressed',String(button.dataset.color===selected[group]));
 }
 for(const button of document.querySelectorAll('[data-style]'))button.setAttribute('aria-pressed',String(button.dataset.style===housing));
 document.getElementById('housingBadge').textContent=housing==='arrondi'?'Coffre arrondi':'Coffre facetté';
}
for(const [group,label]of groups){
 const field=document.createElement('fieldset'),legend=document.createElement('legend'),choice=document.createElement('span'),row=document.createElement('div');
 legend.append(document.createTextNode(label));choice.className='selection';legend.append(choice);labels.set(group,choice);
 row.className='options';rows.set(group,row);
 for(const [id,name,code,hex]of colors){
  const button=document.createElement('button');button.type='button';button.className='color';button.dataset.color=id;button.setAttribute('aria-label',`${label}: ${name} ${code}`);
  const swatch=document.createElement('span');swatch.className='swatch';swatch.style.backgroundColor=hex;
  if(id==='gas-3100'){swatch.style.backgroundImage='radial-gradient(#ffffff44 .6px,transparent .8px)';swatch.style.backgroundSize='3px 3px'}
  const nameLabel=document.createElement('span'),codeLabel=document.createElement('span');nameLabel.textContent=name;codeLabel.className='code';codeLabel.textContent=code;
  button.append(swatch,nameLabel,codeLabel);button.onclick=()=>{selected[group]=id;refreshControls();render()};row.append(button);
 }
 field.append(legend,row);document.getElementById('controls').append(field);
}
for(const button of document.querySelectorAll('[data-style]'))button.onclick=()=>{housing=button.dataset.style;refreshControls();render()};
document.getElementById('reset').onclick=()=>{for(const [group]of groups)selected[group]='acier-reference';refreshControls();render()};
// Read-only state access lets a host page inspect choices without changing the compositing logic.
window.shutterConfigurator={getState:()=>({housing,tablierSize,colors:{...selected},theme:root.dataset.theme}),imagePath,setTheme};
refreshControls();render();

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
 document.addEventListener('visibilitychange',()=>root.classList.toggle('motion-paused',document.hidden));
 new ResizeObserver(paint).observe(stage);window.recapView={prepare,paint,reset};
})();

'use strict';
(() => {
 const el=id=>document.getElementById(id);
 const viewer=el('measureStage'),viewCanvas=el('measureCanvas'),ctx=viewCanvas.getContext('2d');
 const step1=el('measureStep'),step2=el('finishStep'),step3=el('recapStep'),width=el('measureWidth'),height=el('measureHeight');
 const controls=['motionOpen','motionClose','motionLeft','motionRight'].map(el);
 const state={step:0,pose:'closed',angle:0,busy:false,ready:false,widthMm:null,heightMm:null};
 const history=[],cache=new Map();let latestImage=null,displayTicket=0,drag=null,hold=null,latestFolder='closed',latestIndex=0;
 const reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
 const wrap=n=>((n%60)+60)%60;
 const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const record=(type,detail={})=>{history.push({type,...detail});if(history.length>500)history.shift()};
 function valid(){return width.validity.valid&&height.validity.valid&&Number(width.value)>0&&Number(height.value)>0}
 function sync(){
  state.widthMm=Number(width.value)>0?Number(width.value):null;state.heightMm=Number(height.value)>0?Number(height.value):null;
  controls.forEach(button=>button.disabled=!state.ready||(state.busy&&button!==hold?.button));
  el('motionOpen').setAttribute('aria-pressed',String(state.pose==='open'));el('motionClose').setAttribute('aria-pressed',String(state.pose==='closed'));
  el('measureNext').disabled=state.busy||!state.ready||!valid();
  el('stepFinishes').disabled=state.busy||!valid()||!state.ready;
  el('finishNext').disabled=state.busy;el('stepRecap').disabled=state.busy||state.step===1;el('recapBack').disabled=state.busy;el('recapMeasurements').disabled=state.busy;
  el('stepMeasures').disabled=state.busy;el('backMeasurements').disabled=state.busy;
  el('stepModels').disabled=state.busy;el('modelContinue').disabled=state.busy||!state.ready||!modelAvailable();
  if(state.step===0){el('stepFinishes').disabled=true;el('stepRecap').disabled=true;if(!modelAvailable())el('stepMeasures').disabled=true;}
  el('motionPose').textContent=state.busy?'Animation…':state.pose==='open'?'Ouvert':'Fermé';
  viewer.setAttribute('aria-busy',String(state.busy||!state.ready));
  el('widthGuide').textContent=state.widthMm?`${state.widthMm} mm`:'Largeur';
  el('heightGuide').textContent=state.heightMm?`${state.heightMm} mm`:'Hauteur';
 }
 function paint(){
  if(!latestImage)return;
  const pixels=Math.max(1,Math.round(viewer.getBoundingClientRect().width*Math.min(window.devicePixelRatio||1,2)));
  if(viewCanvas.width!==pixels||viewCanvas.height!==pixels){viewCanvas.width=pixels;viewCanvas.height=pixels}
  ctx.clearRect(0,0,pixels,pixels);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';const offset=window.shutterViewOffsets?.motion?.[latestFolder]?.[latestIndex]||[0,0];ctx.drawImage(latestImage,offset[0]/1000*pixels,offset[1]/1000*pixels,pixels,pixels);
 }
 new ResizeObserver(paint).observe(viewer);
 function load(folder,index){
  const key=folder+'/'+index;
  if(cache.has(key)){const value=cache.get(key);cache.delete(key);cache.set(key,value);return value}
  const path=`/configurator/images/motion/${folder}/frame_${String(index).padStart(4,'0')}`;
  const promise=new Promise((resolve,reject)=>{
   const image=new Image();let fallback=false;
   image.onload=()=>image.decode().then(()=>resolve(image),()=>resolve(image));
   image.onerror=()=>{if(!fallback){fallback=true;image.src=path+'.png'}else{cache.delete(key);reject(new Error('Preview frame unavailable'))}};
   image.src=path+'.webp';
  });cache.set(key,promise);
  while(cache.size>16)cache.delete(cache.keys().next().value);
  return promise;
 }
 async function display(folder,index,decodedImage){
  const ticket=++displayTicket,image=decodedImage||await load(folder,index);
  if(ticket!==displayTicket)return;
  // Present one fully decoded view at a time, in sync with the browser repaint.
  await new Promise(resolve=>{let raf;const timer=setTimeout(()=>{cancelAnimationFrame(raf);resolve()},64);raf=requestAnimationFrame(()=>{clearTimeout(timer);resolve()})});if(ticket!==displayTicket)return;
  latestImage=image;latestFolder=folder;latestIndex=index;paint();viewCanvas.setAttribute('aria-label',`${folder==='opening'?'Moving':folder==='open'?'Open':'Closed'} shutter, frame ${index}`);
  record('frame',{folder,index});el('measureStatus').textContent='';
 }
 function warm(folder,angle){for(const d of [-4,-3,-2,-1,1,2,3,4])load(folder,wrap(angle+d)).catch(()=>{})}
 async function exclusive(task){
  if(state.busy||!state.ready)return;
  state.busy=true;drag=null;displayTicket++;sync();
  try{await task()}catch(error){el('measureStatus').textContent='Une image est indisponible. Réessayez après avoir vérifié votre connexion.';record('error',{message:error.message})}
  finally{state.busy=false;sync()}
 }
 async function angleTo(target){
  target=wrap(Math.round(target));let delta=((target-state.angle+90)%60)-30;
  if(!delta){await display(state.pose,state.angle);return}
  const direction=Math.sign(delta),initial=state.angle;
  const images=await Promise.all(Array.from({length:Math.abs(delta)},(_,i)=>load(state.pose,wrap(initial+(i+1)*direction))));
  for(let i=0;i<Math.abs(delta);i++){
   const start=performance.now();state.angle=wrap(state.angle+direction);sync();await display(state.pose,state.angle,images[i]);
   await pause(Math.max(0,33-(performance.now()-start)));
  }
  warm(state.pose,state.angle);
 }
 async function togglePose(next){
  if(state.pose===next)return;
  record('return-to-zero',{pose:state.pose,from:state.angle});await angleTo(0);
  record('pose-start',{from:state.pose,to:next,angle:state.angle});
  const startIndex=next==='open'?0:30,endIndex=next==='open'?30:0,direction=next==='open'?1:-1;
  const images=await Promise.all(Array.from({length:31},(_,i)=>load('opening',startIndex+i*direction)));
  for(let i=startIndex;direction>0?i<=endIndex:i>=endIndex;i+=direction){const started=performance.now();await display('opening',i,images[Math.abs(i-startIndex)]);await pause(Math.max(0,33-(performance.now()-started)))}
  state.pose=next;state.angle=0;await display(state.pose,0);record('pose-complete',{pose:next,angle:0});warm(state.pose,0);
 }
 async function transition(outgoing,incoming){
  if(!reducedMotion.matches){outgoing.classList.add('leaving');await pause(320)}
  outgoing.hidden=true;outgoing.classList.remove('leaving');incoming.classList.add('entering');incoming.hidden=false;
  // Resize the preserved finish canvas after its panel becomes visible.
  if(incoming===step2&&typeof present==='function')present();else if(incoming===step3)window.recapView.paint();else paint();
  await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);incoming.classList.remove('entering');
  if(!reducedMotion.matches)await pause(350);
 }
 async function seamlessFinishTransition(){
  // Hold one canvas over both layouts so the shutter never fades away.
  await render();
  const rect=viewCanvas.getBoundingClientRect(),overlay=document.createElement('canvas');
  overlay.width=viewCanvas.width;overlay.height=viewCanvas.height;
  const overlayContext=overlay.getContext('2d');overlayContext.drawImage(viewCanvas,0,0);
  Object.assign(overlay.style,{position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',zIndex:'1000',pointerEvents:'none'});
  overlay.setAttribute('aria-hidden','true');document.body.append(overlay);
  try{
   const panel=step1.querySelector('.measure-panel');
   if(!reducedMotion.matches){
    await Promise.all([panel.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(12px)'}],{duration:180,fill:'forwards'}).finished,
     step1.querySelector('.motion-toolbar').animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards'}).finished]);
   }
   step1.hidden=true;step2.hidden=false;present();
   await new Promise(requestAnimationFrame);
   const target=canvas.getBoundingClientRect();
   if(!reducedMotion.matches){
    const shift=overlay.animate([{transform:'translate(0,0) scale(1,1)'},{transform:`translate(${target.left-rect.left}px,${target.top-rect.top}px) scale(${target.width/rect.width},${target.height/rect.height})`}],{duration:220,fill:'forwards',easing:'ease-in-out'});
    overlay.style.transformOrigin='top left';
    step2.querySelector('.controls').animate([{opacity:0,transform:'translateX(12px)'},{opacity:1,transform:'translateX(0)'}],{duration:260,easing:'ease-out'});
    await shift.finished;
    await overlay.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-in-out'}).finished;
   }
  }finally{
   overlay.remove();step1.querySelectorAll('.measure-panel,.motion-toolbar').forEach(node=>node.getAnimations().forEach(animation=>animation.cancel()));
  }
 }
 async function next(){
  if(state.step!==1)return;
  if(!valid()){el('measurementForm').reportValidity();return}
  await exclusive(async()=>{
   record('next-start',{pose:state.pose,from:state.angle});
   if(viewer.getBoundingClientRect().bottom<0){viewer.scrollIntoView({block:'center',behavior:reducedMotion.matches?'instant':'smooth'});await pause(reducedMotion.matches?0:350)}
   if(state.pose==='open')await togglePose('closed');
   await angleTo(13);record('next-angle',{pose:state.pose,angle:13});
   el('measurementSummary').textContent=`${state.widthMm} × ${state.heightMm} mm`;
   await seamlessFinishTransition();state.step=2;el('stepMeasures').removeAttribute('aria-current');el('stepFinishes').setAttribute('aria-current','step');
   cache.clear();record('step',{step:2});window.dispatchEvent(new CustomEvent('shutterconfigurationchange',{detail:window.shutterConfigurator.getState()}));
  });
 }
 function activeStep(number){state.step=number;for(const [i,id] of ['stepModels','stepMeasures','stepFinishes','stepRecap'].entries()){if(i===number)el(id).setAttribute('aria-current','step');else el(id).removeAttribute('aria-current')}record('step',{step:number})}
 async function back(){if(state.step===0)return startMeasurements();if(state.step===1)return;await exclusive(async()=>{window.recapView.reset();await transition(state.step===3?step3:step2,step1);activeStep(1)})}
 async function finishBack(){if(state.step!==3)return;await exclusive(async()=>{window.recapView.reset();await transition(step3,step2);activeStep(2)})}
 async function recap(){if(state.step!==2)return;await exclusive(async()=>{
  step2.querySelector('.controls').inert=true;stopDetail();
  try{if(!await render())return;window.recapView.prepare();await transition(step2,step3);activeStep(3);window.recapView.paint();el('stepRecap').focus({preventScroll:true});step3.scrollIntoView({block:'start',behavior:reducedMotion.matches?'instant':'smooth'})}
  finally{step2.querySelector('.controls').inert=false}
 })}

 const modelPane=el('modelStep');
 function modelAvailable(){return document.querySelector('.model-choice[aria-pressed="true"]')?.dataset.model==='plein'}
 async function startMeasurements(){if(state.step!==0||!modelAvailable())return;await exclusive(async()=>{await transition(modelPane,step1);activeStep(1)});}
 async function chooseModel(){if(state.step===0)return;await exclusive(async()=>{window.recapView.reset();await transition(state.step===1?step1:state.step===2?step2:step3,modelPane);activeStep(0)});}
 const modelNames={plein:'Rideau métallique',microperfore:'Rideau microperforé',tubes:'Grille à tubes',grille:'Grille à mailles',sectionnelle:'Porte industrielle'};
 for(const button of document.querySelectorAll('.model-choice'))button.onclick=()=>{
  const id=button.dataset.model;
  for(const choice of document.querySelectorAll('.model-choice')){choice.setAttribute('aria-pressed',String(choice===button));choice.querySelector('i').textContent=choice===button?'✓':'';}
  el('modelPreview').src=id==='plein'?'/configurator/images/motion/closed/frame_0013.webp':'/assets/mobile-models/'+id+'.webp';el('modelPreview').alt=modelNames[id]+' RIGAT';el('modelPreviewName').textContent=modelNames[id];
  const available=id==='plein';el('modelAvailability').textContent=available?'Configurateur disponible':'Bientôt disponible';el('modelAvailability').classList.toggle('is-soon',!available);el('modelSoon').hidden=available;
  el('modelContinue').querySelector('span').textContent=available?'Continuer · Mesures':'Bientôt disponible';sync();
 };
 el('modelContinue').onclick=startMeasurements;el('stepModels').onclick=chooseModel;
 el('finishNext').onclick=recap;el('stepRecap').onclick=recap;el('recapBack').onclick=finishBack;el('recapMeasurements').onclick=back;
 el('motionOpen').onclick=()=>exclusive(()=>togglePose('open'));
 el('motionClose').onclick=()=>exclusive(()=>togglePose('closed'));
 function stopHold(event){if(hold&&(!event||event.pointerId===undefined||event.pointerId===hold.pointerId))hold.active=false}
 for(const [id,direction] of [['motionLeft',-1],['motionRight',1]]){
  const button=el(id);
  button.addEventListener('pointerdown',event=>{
   if(state.busy||!state.ready||state.step!==1||(event.pointerType==='mouse'&&event.button!==0))return;
   event.preventDefault();button.focus({preventScroll:true});button.setPointerCapture(event.pointerId);
   const token={button,pointerId:event.pointerId,active:true};hold=token;
   exclusive(async()=>{try{while(token.active)await angleTo(state.angle+direction)}finally{if(hold===token)hold=null}});
  });
  button.addEventListener('pointerup',stopHold);button.addEventListener('pointercancel',stopHold);button.addEventListener('lostpointercapture',stopHold);
  // Keyboard activation remains available; pointer clicks are handled by the hold loop.
  button.addEventListener('click',event=>{event.preventDefault();if(event.detail===0)exclusive(()=>angleTo(state.angle+direction*6))});
 }
 window.addEventListener('pointerup',stopHold);window.addEventListener('pointercancel',stopHold);window.addEventListener('blur',()=>stopHold());
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopHold()});
 el('measurementForm').onsubmit=event=>{event.preventDefault();next()};el('stepFinishes').onclick=()=>state.step===3?finishBack():next();
 el('backMeasurements').onclick=back;el('stepMeasures').onclick=back;
 for(const input of [width,height]){
  input.addEventListener('input',sync);
  input.addEventListener('focus',()=>viewer.classList.add('show-guides'));
  input.addEventListener('blur',()=>{if(![width,height].includes(document.activeElement))viewer.classList.remove('show-guides')});
 }
 viewer.addEventListener('pointerdown',event=>{if(state.busy||!state.ready||event.target.closest('button')||(event.pointerType==='mouse'&&event.button!==0))return;drag={id:event.pointerId,x:event.clientX,angle:state.angle};viewer.setPointerCapture(event.pointerId)});
 viewer.addEventListener('pointermove',event=>{
  if(!drag||event.pointerId!==drag.id||state.busy)return;
  const dx=event.clientX-drag.x;if(Math.abs(dx)>6)event.preventDefault();
  const angle=wrap(drag.angle+Math.round(dx/8));if(angle===state.angle)return;state.angle=angle;sync();display(state.pose,angle).then(()=>warm(state.pose,angle)).catch(()=>{el('measureStatus').textContent='Cette vue ne peut pas être chargée. Réessayez.'});
 },{passive:false});
 const stopDrag=()=>{drag=null};viewer.addEventListener('pointerup',stopDrag);viewer.addEventListener('pointercancel',stopDrag);viewer.addEventListener('lostpointercapture',stopDrag);
 viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();exclusive(()=>angleTo(state.angle+(event.key==='ArrowRight'?6:-6)))}});
 const originalState=window.shutterConfigurator.getState;
 window.shutterConfigurator.getState=()=>({...originalState(),measurements:{widthMm:state.widthMm,heightMm:state.heightMm}});
 window.measurementFlow={getState:()=>({...state}),getHistory:()=>history.map(e=>({...e})),setAngle:n=>exclusive(()=>angleTo(n)),open:()=>exclusive(()=>togglePose('open')),close:()=>exclusive(()=>togglePose('closed')),next,back,recap,finishBack};
 sync();display('closed',0).then(()=>{state.ready=true;sync();warm('closed',0)}).catch(()=>{el('measureStatus').textContent='L’aperçu ne peut pas être chargé. Réessayez après avoir vérifié votre connexion.'});
})();

(()=>{ const box=document.createElement('div');box.className='rigat-export';const copy=document.createElement('button');copy.type='button';copy.textContent='Copier le récapitulatif';const download=document.createElement('button');download.type='button';download.textContent='Télécharger';const email=document.createElement('a');email.textContent='Parlons de mon projet ↗';email.href='#';const status=document.createElement('p');status.className='rigat-export-status';status.setAttribute('role','status');
 function summary(){const state=window.shutterConfigurator.getState();return ['RIGAT — RIDEAU MÉTALLIQUE',...document.querySelectorAll('#recapDetails .recap-item')].map(v=>typeof v==='string'?v:v.querySelector('dt').textContent+' : '+v.querySelector('dd').textContent).join('\n')+'\n\nDimensions et faisabilité à confirmer avec RIGAT.';}
 copy.onclick=async()=>{try{await navigator.clipboard.writeText(summary());status.textContent='Récapitulatif copié.';}catch{status.textContent='La copie est indisponible. Utilisez le téléchargement.';}};
 download.onclick=()=>{const url=URL.createObjectURL(new Blob([summary()],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='RIGAT-mon-rideau-metallique.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Récapitulatif téléchargé.';};
 email.onclick=()=>{email.href='mailto:contact@fabricant-rideaux-metalliques.com?subject='+encodeURIComponent('Mon projet RIGAT — Rideau métallique')+'&body='+encodeURIComponent('Bonjour,\n\nJe souhaite étudier ce projet :\n\n'+summary()+'\n\nNom :\nVille :\nTéléphone :');};
 box.append(copy,download,email);document.querySelector('.recap-summary').append(box,status);const note=document.createElement('p');note.className='note';note.textContent='Votre récapitulatif reste dans votre navigateur. Le bouton de contact ouvre votre messagerie ; rien n’est envoyé automatiquement.';document.querySelector('.recap-summary').append(note);
})();
let lastStep=0;new MutationObserver(()=>{const step=window.measurementFlow?.getState().step;if(step!==lastStep){lastStep=step;root.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}}).observe(root.querySelector('.step-nav'),{attributes:true,subtree:true});
};
