import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  Configuration,
  Part,
  finishes,
} from "@/components/configurator/configuration";
export type MovingPart = { object: T.Object3D; y: number; section?: boolean };
export function createProduct(kit: T.Group, initial: Configuration) {
  const group = new T.Group();
  let config = initial,
    moving: MovingPart[] = [];
  const geometries = new Set<T.BufferGeometry>(),
    materials = new Set<T.Material>(),
    textures = new Set<T.Texture>(),
    clipping = new T.Plane(new T.Vector3(0, -1, 0), 3),
    rubber = new T.MeshStandardMaterial({ color: 0x151c24, roughness: 0.85 });
  function material(part: Part, holes = false) {
    const finish = finishes.find((f) => f.id === config.colors[part])!,
      m = new T.MeshStandardMaterial({
        color: finish.hex,
        metalness: finish.id === "acier" ? 0.88 : 0.12,
        roughness: finish.id === "acier" ? 0.26 : 0.33,
        envMapIntensity: 1.15,
        side: T.DoubleSide,
      });
    m.name = part + "_" + finish.id;
    materials.add(m);
    if (part === "curtain" || part === "bottom") {
      m.clippingPlanes = [clipping];
      m.clipShadows = true;
    }
    if (holes) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(16, 16, 9, 0, Math.PI * 2);
      ctx.arc(48, 48, 9, 0, Math.PI * 2);
      ctx.fill();
      const t = new T.CanvasTexture(canvas);
      t.wrapS = t.wrapT = T.RepeatWrapping;
      t.repeat.set(config.width / 1000 / 0.025, 0.14 / 0.025);
      t.anisotropy = 4;
      textures.add(t);
      m.alphaMap = t;
      m.alphaTest = 0.5;
    }
    return m;
  }
  function clear() {
    group.clear();
    geometries.forEach((g) => g.dispose());
    geometries.clear();
    materials.forEach((m) => m.dispose());
    materials.clear();
    textures.forEach((t) => t.dispose());
    textures.clear();
    moving = [];
  }
  function source(name: string, part: Part, w: number, h: number, d: number) {
    const original = kit.getObjectByName(name);
    if (!original) throw Error("Missing source part " + name);
    const clone = original.clone(true),
      size = new T.Box3().setFromObject(clone).getSize(new T.Vector3()),
      mat = material(part);
    clone.scale.set(w / size.x, h / size.y, d / size.z);
    clone.traverse((o) => {
      if (o instanceof T.Mesh) {
        o.material = o.material.name.includes("rubber") ? rubber : mat;
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return clone;
  }
  function mesh(g: T.BufferGeometry, m: T.Material) {
    geometries.add(g);
    const o = new T.Mesh(g, m);
    o.castShadow = true;
    o.receiveShadow = true;
    return o;
  }
  function box(w: number, h: number, d: number, m: T.Material) {
    return mesh(new T.BoxGeometry(w, h, d), m);
  }
  function update(c: Configuration) {
    config = c;
    clear();
    const w = c.width / 1000,
      h = c.height / 1000,
      sectional = c.model === "sectionnelle";
    clipping.constant = h + (sectional ? 0.5 : 0.035);
    const gm = material("guides"),
      bm = material("curtain", c.model === "microperfore");
    for (const side of [-1, 1]) {
      const o = source("guide", "guides", 0.085, h, 0.105);
      o.position.set(side * (w / 2 + 0.015), h / 2, -0.025);
      group.add(o);
    }
    const cover = source(
      "housing_" + (sectional ? "facette" : c.housing),
      sectional ? "guides" : "housing",
      w + (sectional ? 0.19 : 0.23),
      sectional ? 0.24 : 0.4,
      sectional ? 0.3 : 0.48,
    );
    cover.position.set(0, h + (sectional ? 0.09 : 0.16), -0.08);
    group.add(cover);
    if (sectional)
      for (const side of [-1, 1]) {
        const o = box(0.045, 0.06, h * 0.85, gm);
        o.position.set(side * (w / 2 + 0.025), h + 0.03, -h * 0.425);
        group.add(o);
      }
    if (c.model === "plein" || c.model === "microperfore") {
      const n = Math.ceil((h - 0.1) / 0.14),
        pitch = (h - 0.1) / n;
      let base: T.BufferGeometry | undefined;
      kit.getObjectByName("slat")!.traverse((o) => {
        if (o instanceof T.Mesh) base ??= o.geometry;
      });
      const g = base!.clone();
      g.computeBoundingBox();
      const bounds = g.boundingBox!,
        size = bounds.getSize(new T.Vector3()),
        p = g.attributes.position,
        uv = new Float32Array(p.count * 2);
      for (let i = 0; i < p.count; i++) {
        uv[i * 2] = (p.getX(i) - bounds.min.x) / size.x;
        uv[i * 2 + 1] = (p.getY(i) - bounds.min.y) / size.y;
      }
      g.setAttribute("uv", new T.BufferAttribute(uv, 2));
      geometries.add(g);
      for (let i = 0; i < n; i++) {
        const o = new T.Mesh(g, bm);
        o.scale.set(w / size.x, (pitch + 0.003) / size.y, 0.032 / size.z);
        o.position.set(0, 0.1 + pitch * (i + 0.5), 0);
        o.castShadow = true;
        o.receiveShadow = true;
        group.add(o);
        moving.push({ object: o, y: o.position.y });
      }
    } else if (c.model === "tubes") {
      const rows = Math.max(5, Math.round(h / 0.17)),
        pitch = (h - 0.12) / rows,
        g = new T.CylinderGeometry(0.012, 0.012, 1, 10),
        pieces: T.BufferGeometry[] = [];
      for (let r = 0; r < rows; r++) {
        const y = 0.14 + r * pitch;
        pieces.push(
          g
            .clone()
            .rotateZ(Math.PI / 2)
            .scale(w, 1, 1)
            .translate(0, y, 0),
        );
        for (let x = -w / 2 + 0.12; x < w / 2; x += 0.28)
          pieces.push(
            g
              .clone()
              .scale(1, pitch, 1)
              .translate(x, y + pitch / 2, 0),
          );
      }
      const o = mesh(mergeGeometries(pieces), bm);
      pieces.forEach((g) => g.dispose());
      g.dispose();
      group.add(o);
      moving.push({ object: o, y: 0 });
    } else if (c.model === "grille") {
      const cols = Math.max(3, Math.round(w / 0.28)),
        rows = Math.max(4, Math.round((h - 0.1) / 0.32)),
        cw = w / cols,
        ch = (h - 0.1) / rows,
        pieces: T.BufferGeometry[] = [];
      for (let r = 0; r < rows; r++)
        for (let col = 0; col < cols; col++) {
          const x = -w / 2 + cw * (col + 0.5),
            y = 0.1 + ch * (r + 0.5),
            points = [
              new T.Vector3(x - cw / 2, y, 0),
              new T.Vector3(x, y + ch / 2, 0.008),
              new T.Vector3(x + cw / 2, y, 0),
              new T.Vector3(x, y - ch / 2, -0.008),
            ],
            curve = new T.CurvePath<T.Vector3>();
          for (let i = 0; i < 4; i++) {
            const prev = points[(i + 3) % 4],
              p = points[i],
              next = points[(i + 1) % 4];
            curve.add(
              new T.QuadraticBezierCurve3(
                p.clone().lerp(prev, 0.18),
                p,
                p.clone().lerp(next, 0.18),
              ),
            );
            curve.add(
              new T.LineCurve3(
                p.clone().lerp(next, 0.18),
                next.clone().lerp(p, 0.18),
              ),
            );
          }
          pieces.push(new T.TubeGeometry(curve, 40, 0.014, 6, true));
        }
      const o = mesh(mergeGeometries(pieces), bm);
      pieces.forEach((g) => g.dispose());
      group.add(o);
      moving.push({ object: o, y: 0 });
    } else {
      const n = Math.max(4, Math.round(h / 0.48)),
        pitch = (h - 0.1) / n;
      for (let i = 0; i < n; i++) {
        const panel = new T.Group(),
          windowRow = i === Math.floor(n * 0.45),
          count = Math.max(2, Math.min(5, Math.floor(w / 0.7))),
          ww = Math.min(0.36, (w / (count + 1)) * 0.65),
          wh = Math.min(0.15, pitch * 0.36);
        if (windowRow) {
          const shape = new T.Shape();
          shape.moveTo(-w / 2, -pitch / 2 + 0.0045);
          shape.lineTo(w / 2, -pitch / 2 + 0.0045);
          shape.lineTo(w / 2, pitch / 2 - 0.0045);
          shape.lineTo(-w / 2, pitch / 2 - 0.0045);
          shape.closePath();
          const glassMat = new T.MeshStandardMaterial({
            color: 0x253342,
            metalness: 0.35,
            roughness: 0.15,
            transparent: true,
            opacity: 0.65,
            side: T.DoubleSide,
          });
          materials.add(glassMat);
          for (let j = 0; j < count; j++) {
            const x = -w / 2 + (w * (j + 1)) / (count + 1),
              hole = new T.Path();
            hole.moveTo(x - ww / 2, -wh / 2);
            hole.lineTo(x - ww / 2, wh / 2);
            hole.lineTo(x + ww / 2, wh / 2);
            hole.lineTo(x + ww / 2, -wh / 2);
            hole.closePath();
            shape.holes.push(hole);
            const glass = mesh(new T.PlaneGeometry(ww, wh), glassMat);
            glass.position.set(x, 0, 0.028);
            panel.add(glass);
          }
          const face = mesh(
            new T.ExtrudeGeometry(shape, {
              depth: 0.055,
              bevelEnabled: true,
              bevelSize: 0.002,
              bevelThickness: 0.002,
              bevelSegments: 2,
              steps: 1,
            }),
            bm,
          );
          face.position.z = -0.0275;
          panel.add(face);
        } else panel.add(box(w, pitch - 0.009, 0.055, bm));
        if (!windowRow)
          for (const y of [-pitch * 0.29, 0, pitch * 0.29]) {
            const rib = box(w, 0.006, 0.008, bm);
            rib.position.set(0, y, 0.029);
            panel.add(rib);
          }
        for (const x of [-w * 0.36, w * 0.36]) {
          const hinge = box(0.045, 0.085, 0.018, gm);
          hinge.position.set(x, -pitch / 2 + 0.02, -0.04);
          panel.add(hinge);
        }
        panel.position.set(0, 0.1 + pitch * (i + 0.5), 0);
        group.add(panel);
        moving.push({ object: panel, y: panel.position.y, section: true });
      }
    }
    const bottom = sectional
      ? box(w, 0.095, 0.07, material("bottom"))
      : source("bottom", "bottom", w, 0.1, 0.05);
    bottom.position.set(0, 0.055, 0);
    group.add(bottom);
    moving.push({ object: bottom, y: 0.055, section: sectional });
    if (sectional) {
      const seal = box(w, 0.015, 0.065, rubber);
      seal.position.y = -0.045;
      bottom.add(seal);
    }
  }
  update(initial);
  return {
    group,
    get moving() {
      return moving;
    },
    clipping,
    update,
    dispose: () => {
      clear();
      rubber.dispose();
    },
  };
}
export function applyOpening(
  moving: MovingPart[],
  height: number,
  progress: number,
) {
  for (const m of moving) {
    const y = m.y + progress * (height + 0.2);
    if (m.section) {
      const turn = height - 0.15;
      if (y < turn) {
        m.object.position.set(0, y, 0);
        m.object.rotation.x = 0;
      } else {
        const travel = y - turn,
          r = 0.2,
          angle = Math.min(travel / r, Math.PI / 2);
        m.object.position.set(
          0,
          turn + r * Math.sin(angle),
          -r * (1 - Math.cos(angle)) - Math.max(0, travel - (r * Math.PI) / 2),
        );
        m.object.rotation.x = -angle;
      }
      m.object.visible = true;
    } else {
      m.object.position.y = y;
      m.object.visible = y < height + 0.1 || m.y === 0;
    }
  }
}
