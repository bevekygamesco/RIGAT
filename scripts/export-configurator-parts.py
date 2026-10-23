"""Blender 4.3: bake the supplied shutter into a reusable GLB kit.
blender -b --python scripts/export-configurator-parts.py -- INPUT.blend OUTPUT.glb
"""
import bpy,sys
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:];bpy.ops.wm.open_mainfile(filepath=args[0])
s=bpy.data.scenes['02_Finishes_Preview'];bpy.context.window.scene=s;s.frame_set(13);dg=bpy.context.evaluated_depsgraph_get()
parts={'housing_facette':['COFFRE','Coffre facette left endcap','Coffre facette right endcap']+[f'Coffre facette {side} fastener {i}' for side in ['left','right'] for i in range(2)],'housing_arrondi':['COFFRE_ARRONDI','Coffre arrondi left endcap','Coffre arrondi right endcap']+[f'Coffre arrondi {side} fastener {i}' for side in ['left','right'] for i in range(2)],'guide':['COULISSERIGHT.001','Cube.001'],'bottom':['Layer:KK','Cube.003'],'slat':['TABLIER']}
new=bpy.data.scenes.new('RIGAT web components');bpy.context.window.scene=new
for group,names in parts.items():
 verts=[];faces=[];mids=[];materials=[]
 for name in names:
  obj=bpy.data.objects[name];e=obj.evaluated_get(dg);m=e.to_mesh();offset=len(verts);vv=[e.matrix_world@v.co for v in m.vertices]
  keep={i for i,v in enumerate(vv) if v.z<min(p.z for p in vv)+.147} if group=='slat' else set(range(len(vv)))
  remap={j:offset+i for i,j in enumerate(sorted(keep))}
  verts.extend((vv[i].y,vv[i].x,vv[i].z) for i in sorted(keep))
  base=len(materials);materials.extend(slot.material for slot in obj.material_slots)
  for p in m.polygons:
   if all(i in keep for i in p.vertices):faces.append(tuple(remap[i] for i in p.vertices));mids.append(base+p.material_index)
  e.to_mesh_clear()
 center=Vector(tuple((min(v[i] for v in verts)+max(v[i] for v in verts))/2 for i in range(3)))
 mesh=bpy.data.meshes.new(group);mesh.from_pydata([Vector(v)-center for v in verts],[],faces);mesh.update()
 for mat in materials:mesh.materials.append(mat)
 for p,mi in zip(mesh.polygons,mids):p.material_index=mi;p.use_smooth=(group=='slat' or 'arrondi' in group)
 obj=bpy.data.objects.new(group,mesh);new.collection.objects.link(obj)
 for i,mat in enumerate(mesh.materials):
  key='rubber' if mat and 'Rubber' in mat.name else 'steel';clean=bpy.data.materials.get('web_'+key)
  if not clean:
   clean=bpy.data.materials.new('web_'+key);clean.use_nodes=True;p=clean.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(.015,.018,.022,1) if key=='rubber' else (.54,.58,.63,1);p.inputs['Metallic'].default_value=0 if key=='rubber' else .9;p.inputs['Roughness'].default_value=.75 if key=='rubber' else .28
  mesh.materials[i]=clean
bpy.ops.object.select_all(action='DESELECT')
for obj in new.objects:obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=args[1],export_format='GLB',use_selection=True,use_active_scene=True,export_animations=False,export_cameras=False,export_lights=False,export_yup=True)
