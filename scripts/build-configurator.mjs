/** Build the supplied image engine into the page, with locally scoped styles. */
import fs from 'node:fs';
import postcss from 'postcss';
const base='public/configurator/';
const source=fs.readFileSync(base+'index.html','utf8');
let markup=source.match(/<body>([\s\S]*?)<script src="view-centering.js"><\/script>/)[1];
markup=markup.replaceAll('<main ', '<section ').replaceAll('</main>', '</section>');
markup=markup.replaceAll('/assets/mobile-models/plein.webp','/configurator/images/motion/closed/frame_0013.webp').replaceAll('/assets/mobile-models/plein-thumb.webp','/configurator/images/motion/closed/frame_0013.webp');
fs.writeFileSync('lib/configurator/markup.ts','// Generated from the supplied configurator by scripts/build-configurator.mjs.\nexport const configuratorMarkup = '+JSON.stringify(markup)+';\n');
let css=source.match(/<style>([\s\S]*?)<\/style>/)[1]+'\n'+fs.readFileSync(base+'rigat-brand.css','utf8');
const ast=postcss.parse(css);
ast.walkRules(rule=>{
 if(rule.parent.type==='atrule'&&/keyframes$/.test(rule.parent.name))return;
 rule.selectors=rule.selectors.map(selector=>{
  selector=selector.replace(/\bmain\b/g,'.flow-step');
  if(/^(?:html|body|:root)\b|^:root/.test(selector))return selector.replace(/^(?:html|body|:root)/,'#rigat-configurator').replace(/\sbody\b/g,'');
  return '#rigat-configurator '+selector;
 });
});
fs.writeFileSync('styles/rigat-configurator-engine.css',ast.toString()+'\n#rigat-configurator{color:var(--ink);font:14px/1.5 Inter,system-ui,sans-serif;min-width:0;scroll-margin-top:100px}#rigat-configurator .flow-step{display:grid}#rigat-configurator [hidden]{display:none!important}#rigat-configurator .flow-step>footer{position:static;background:none}#rigat-configurator .model-image-stage img{object-fit:contain}#rigat-configurator .visual{left:auto;right:auto;bottom:auto;width:auto;height:auto;overflow:visible;transform:none}#rigat-configurator .stage{position:relative;inset:auto;width:100%;height:auto;aspect-ratio:1;min-height:0;transform:none;isolation:isolate}\n');
let engine=source.match(/<script>\s*('use strict';[\s\S]*?)<\/script>/)[1];
engine=engine.replaceAll('`images/','`/configurator/images/').replaceAll('document.documentElement.dataset.theme','root.dataset.theme');
let flow=fs.readFileSync(base+'measurement-flow.js','utf8').replaceAll('`images/','`/configurator/images/');
flow=flow.replace("el('modelPreview').src='/assets/mobile-models/'+id+'.webp'", "el('modelPreview').src=id==='plein'?'/configurator/images/motion/closed/frame_0013.webp':'/assets/mobile-models/'+id+'.webp'");
// Ensure all step changes return to the native step bar, using the page's one scrollbar.
const host=fs.readFileSync(base+'rigat-host.js','utf8');
const exportTools=host.slice(host.indexOf(" const box="),host.lastIndexOf('})();'));
const code=`/* Original supplied image compositor and measurement engine. No iframe or WebGL. */\nwindow.initializeRigatConfigurator=function(root){\nif(root.dataset.initialized)return;root.dataset.initialized='true';\n${fs.readFileSync(base+'view-centering.js','utf8')}\n${engine}\n${fs.readFileSync(base+'recap-view.js','utf8').replaceAll('document.documentElement.classList','root.classList')}\n${flow}\n(()=>{${exportTools}})();\nlet lastStep=0;new MutationObserver(()=>{const step=window.measurementFlow?.getState().step;if(step!==lastStep){lastStep=step;root.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}}).observe(root.querySelector('.step-nav'),{attributes:true,subtree:true});\n};\n`;
fs.writeFileSync(base+'integrated.js',code);
