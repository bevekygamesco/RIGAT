"""Editable default-size collection. First run node scripts/check-configurator.mjs --export DIR.
Then: blender -b --python scripts/build-configurator-collection.py -- DIR OUTPUT.blend
Web opening, dimensions and per-part finishes are controlled by product.ts.
"""
import bpy,sys
from mathutils import Vector
from pathlib import Path
args=sys.argv[sys.argv.index('--')+1:];folder=Path(args[0]);output=Path(args[1])
bpy.ops.wm.read_factory_settings(use_empty=True);first=None
for i,model in enumerate(['plein','microperfore','tubes','grille','sectionnelle']):
 s=bpy.context.scene if i==0 else bpy.data.scenes.new(model);s.name=f'{i+1:02d} · {model}';bpy.context.window.scene=s
 bpy.ops.import_scene.gltf(filepath=str(folder/(model+'.glb')))
 if model=='microperfore':
  for o in s.objects:
   if o.type!='MESH':continue
   for mat in o.data.materials:
    if not mat or not mat.name.startswith('curtain') or not mat.use_nodes or mat.get('perforated'):continue
    nt=mat.node_tree;p=nt.nodes.get('Principled BSDF');uv=nt.nodes.new('ShaderNodeTexCoord');scale=nt.nodes.new('ShaderNodeVectorMath');scale.operation='MULTIPLY';scale.inputs[1].default_value=(120,5.6,1);nt.links.new(uv.outputs['UV'],scale.inputs[0]);tex=nt.nodes.new('ShaderNodeTexImage');im=bpy.data.images.get('RIGAT microperforation')
    if not im:
     im=bpy.data.images.new('RIGAT microperforation',64,64,alpha=True);pixels=[]
     for y in range(64):
      for x in range(64):
       v=0 if min((x-16)**2+(y-16)**2,(x-48)**2+(y-48)**2)<81 else 1;pixels.extend((v,v,v,1))
     im.pixels=pixels;im.pack()
    tex.image=im;tex.extension='REPEAT';nt.links.new(scale.outputs[0],tex.inputs['Vector']);nt.links.new(tex.outputs['Color'],p.inputs['Alpha']);mat.surface_render_method='DITHERED';mat['perforated']=True
 s.render.engine='CYCLES';s.cycles.samples=64;s.cycles.use_denoising=True;s.render.resolution_x=s.render.resolution_y=1200;s.render.resolution_percentage=100
 world=bpy.data.worlds.new('Studio '+model);world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.5,.6,.8,1);world.node_tree.nodes['Background'].inputs[1].default_value=.25;s.world=world
 for name,loc,power,size in [('Key',(-3,-4,6),950,4),('Rim',(3,1,4),1100,3),('Softbox',(0,-5,2),400,2)]:
  light=bpy.data.lights.new(name,'AREA');light.energy=power;light.shape='RECTANGLE';light.size=size;light.size_y=size*2;o=bpy.data.objects.new(name,light);s.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,1.5))-o.location).to_track_quat('-Z','Y').to_euler()
 camera=bpy.data.cameras.new('Camera');o=bpy.data.objects.new('Camera',camera);s.collection.objects.link(o);o.location=(4,-6.2,3.1);o.rotation_euler=(Vector((0,0,1.55))-o.location).to_track_quat('-Z','Y').to_euler();camera.type='ORTHO';camera.ortho_scale=4.7;s.camera=o;s['description']='Editable visual collection. Interactive sizing, per-part finishes and opening are controlled by lib/configurator/product.ts.'
 if first is None:first=s
bpy.context.window.scene=first
text=bpy.data.texts.new('READ ME');text.write('Five scenes, one default-size product per scene. Original supplied model: source/Rideau_Metallique.blend. Added variants are visual representations based on the website references. Interactive sizing, finishes and opening live in lib/configurator/product.ts.')
bpy.ops.wm.save_as_mainfile(filepath=str(output),compress=True)
