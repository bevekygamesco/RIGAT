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
  const path=`images/motion/${folder}/frame_${String(index).padStart(4,'0')}`;
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
  el('modelPreview').src='/assets/mobile-models/'+id+'.webp';el('modelPreview').alt=modelNames[id]+' RIGAT';el('modelPreviewName').textContent=modelNames[id];
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
