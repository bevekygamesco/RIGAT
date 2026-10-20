"""After rendering, run with Python + Pillow to rebuild desktop/mobile WebP assets."""
from pathlib import Path
from PIL import Image
import json,time,hashlib,os
root=Path(__file__).resolve().parent;raw=root/'renders';dest=root.parent/'assets';hd=dest/'frames-hd';mobile=dest/'frames-mobile-hd';hd.mkdir(exist_ok=True);mobile.mkdir(exist_ok=True)
while True:
 for meta in sorted(raw.glob('frame_*.json')):
  output=hd/(meta.stem+'.webp')
  if output.exists():continue
  try:
   m=json.loads(meta.read_text());crop=Image.open(meta.with_suffix('.png')).convert('RGBA');im=Image.new('RGBA',(1920,1280));im.alpha_composite(crop,(m['x'],m['top']))
   temp=output.with_suffix('.tmp');im.save(temp,format='WEBP',quality=96,method=4);temp.replace(output)
   im.resize((960,640),Image.Resampling.LANCZOS).save(mobile/output.name,format='WEBP',quality=94,method=4)
   if m['index'] in [262,280,118,198,22]:
    name={262:'reference',280:'hero',118:'motor',198:'coffre',22:'opening'}[m['index']];im.save(root/(name+'.png'));im.save(dest/'stills'/(name+'.webp'),format='WEBP',quality=97,method=4)
   print('CONVERTED',m['index'],len(list(hd.glob('*.webp'))),flush=True)
  except (OSError,ValueError,KeyError):pass
 if (root/'RENDER_COMPLETE').exists() and len(list(hd.glob('*.webp')))==281:break
 time.sleep(2)
print('HD_CONVERSION_COMPLETE',flush=True)
