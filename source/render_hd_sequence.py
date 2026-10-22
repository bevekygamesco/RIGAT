"""Run with the included scene open in Blender 4.3. Renders to source/renders/.
Set the Cycles sample count below higher for your final GPU export if desired.
The original material and lighting are preserved; the website sequence is baked.
"""
import bpy,time,json,math,os,shutil
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
s=bpy.context.scene;root=Path(bpy.data.filepath).parent;out=root/'renders';out.mkdir(exist_ok=True,parents=True)
s.camera=bpy.data.objects['HERO camera'];camera=s.camera
s.render.engine='CYCLES';s.render.resolution_x=1920;s.render.resolution_y=1280;s.render.resolution_percentage=100;s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.image_settings.compression=15
s.cycles.use_light_tree=False;s.cycles.use_denoising=True;s.cycles.seed=1956;s.cycles.use_animated_seed=False;s.cycles.adaptive_threshold=.08;s.cycles.adaptive_min_samples=4;s.cycles.samples=16;s.render.use_motion_blur=False;s.render.use_persistent_data=True
s.cycles.max_bounces=6;s.cycles.diffuse_bounces=3;s.cycles.glossy_bounces=3;s.cycles.transmission_bounces=3
for name in ['Seamless white studio cyclorama','Negative fill card']:
 o=bpy.data.objects.get(name)
 if o:o.hide_render=True
for m in list(s.timeline_markers):s.timeline_markers.remove(m)
s.frame_start=1;s.frame_end=420;s.render.fps=30;s.frame_set(394);camera.data.dof.use_dof=False
s['RESTORED_LOOK']='Exact V7 / V5 studio and steel appearance, matched to the user reference frame_0131.webp. Native 1920x1280 Cycles renders, fixed random seed, no browser shadow maps.'
s.render.use_border=False;s.cycles.samples=128
bpy.ops.wm.save_as_mainfile(filepath=str(root/'RIGAT_Restored_HD_Blender43.blend'),compress=True)
s.cycles.samples=16
frames=json.loads((root/'timeline.json').read_text())['frames']
(root/'timeline.json').write_text(json.dumps({'width':1920,'height':1280,'frames':frames,'seed':1956,'max_samples':16,'min_samples':4,'adaptive_threshold':.08}))
visible=json.loads((root/'visible-bounds.json').read_text())
order=list(dict.fromkeys([262,280,118,198,22,0]+list(range(len(frames)))))
for index in order:
 dest=out/f'frame_{index:04d}.png';meta=out/f'frame_{index:04d}.json'
 if dest.exists() and meta.exists():continue
 b=visible[str(index)]
 if b is None:
  shutil.copy2(root/'transparent-hd.png',dest);meta.write_text(json.dumps({'index':index,'frame':frames[index],'x':0,'top':0,'box':[0,0,1920,1280],'seconds':0}));continue
 f=frames[index];s.frame_set(int(f),subframe=f-int(f));bpy.context.view_layer.update()
 ease=lambda x:(lambda q:q*q*(3-2*q))(max(0,min(1,x)))
 depth=max(ease((f-132)/20)*ease((218-f)/20),ease((f-256)/20)*ease((334-f)/20))
 camera.data.dof.use_dof=depth>0
 if depth>0:camera.data.dof.aperture_fstop=16-12*depth
 x0=max(0,b[0]*2-48);x1=min(1920,b[2]*2+48);y0=max(0,(640-b[3])*2-48);y1=min(1280,(640-b[1])*2+48)
 s.render.use_border=True;s.render.use_crop_to_border=True;s.render.border_min_x=(x0+.125)/1920;s.render.border_max_x=min(1,(x1+.125)/1920);s.render.border_min_y=(y0+.125)/1280;s.render.border_max_y=min(1,(y1+.125)/1280);s.render.filepath=str(dest)
 t=time.time();bpy.ops.render.render(write_still=True)
 meta.write_text(json.dumps({'index':index,'frame':f,'x':x0,'top':1280-y1,'box':[x0,y0,x1,y1],'seconds':time.time()-t}))
 done=len(list(out.glob('*.json')));(root/'progress.json').write_text(json.dumps({'done':done,'total':len(frames),'last':index,'seconds':time.time()-t}))
 print('HD_FRAME_DONE',index,done,'/',len(frames),round(time.time()-t,2),flush=True)
(root/'RENDER_COMPLETE').write_text('281 native HD frames complete')
print('RESTORED_HD_COMPLETE',flush=True)
