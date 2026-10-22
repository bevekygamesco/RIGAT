export function initializeComposition() {
'use strict';
const starts=[0,.145,.30,.47,.64,.83],clamp=x=>Math.min(1,Math.max(0,x)),ease=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
function sample(progress){
 const p=clamp(progress);let side=0,travel=0,roll=0;
 for(let i=1;i<starts.length;i++){
  const a=starts[i]-.075,b=starts[i]-.020;
  if(p<a)break;
  const t=clamp((p-a)/(b-a)),q=ease(t),from=(i-1)%2,to=i%2;
  side=from+(to-from)*q;travel=Math.sin(q*Math.PI);roll=(to-from)*travel*.025;
  if(t<1)break;
 }
 // One focus beat in the first centred transition. A quintic envelope returns
 // exactly to the existing shot before chapter 02, forwards or in reverse.
 const focus=ease((p-.075)/.018)*(1-ease((p-.107)/.018));
 // Begin the colour fade at the earlier, right-aligned shaft view (about
 // source web frame 34), then restore white with the existing zoom release.
 const colorFocus=clamp(ease((p-.064)/.029)*(1-ease((p-.107)/.018)));
 const originalX=.40-.38*side;
 return {modelX:originalX+(.21-originalX)*focus,side,zoom:1-.075*travel,roll,travel,focus,colorFocus};
}
function opacity(p,i){const a=starts[i],b=i<5?starts[i+1]:2;
 const enter=i===0?1:ease((p-(a-.015))/.015),leave=i===5?0:ease((p-(b-.090))/.015);
 return {opacity:enter*(1-leave),enter,leave};}
// Reserve a little more scroll travel for the fully centred blue close-up.
// The source camera and frames stay fixed here, then continue along their path.
const focusAt=.0975,focusTravel=Math.min(.25,Math.max(0,Number(window.RigatSettings?.zoomExtraTravel??.04)||0));
const finalAt=.83,finalTravel=Math.min(.25,Math.max(.02,Number(window.RigatSettings?.finalZoomTravel)||.07)),finalStart=1-finalTravel;
function baseTime(p){
 p=clamp(p);if(p<=finalStart)return p*finalAt/finalStart;
 // A cubic joins at the same velocity, then eases to the exact final pose.
 const t=(p-finalStart)/finalTravel,t2=t*t,t3=t2*t,slope=finalAt/finalStart*finalTravel;
 return (2*t3-3*t2+1)*finalAt+(t3-2*t2+t)*slope+(-2*t3+3*t2);
}
function baseScroll(p){
 p=clamp(p);if(p<=finalAt)return p*finalStart/finalAt;
 let a=finalStart,b=1;for(let i=0;i<40;i++){const m=(a+b)/2;if(baseTime(m)<p)a=m;else b=m;}return (a+b)/2;
}
const focusStart=baseScroll(focusAt)*(1-focusTravel);
function storyTime(p){p=clamp(p);if(p<focusStart)return baseTime(p/(1-focusTravel));if(p<=focusStart+focusTravel)return focusAt;return baseTime((p-focusTravel)/(1-focusTravel));}
function scrollTime(p){p=clamp(p);return p<focusAt?baseScroll(p)*(1-focusTravel):p>focusAt?focusTravel+baseScroll(p)*(1-focusTravel):focusStart+focusTravel/2;}
window.RigatComposition=Object.freeze({sample,opacity,starts,storyTime,scrollTime});
}
