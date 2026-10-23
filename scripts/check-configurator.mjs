/** Geometry and reversible opening checks; no GPU or browser required.
 * node scripts/check-configurator.mjs [--export /absolute/output/directory]
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import * as T from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
const root = fileURLToPath(new URL("../", import.meta.url)),
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), "rigat-geometry-"));
try {
  for (const [src, name] of [
    ["components/configurator/configuration.ts", "configuration.mjs"],
    ["lib/configurator/product.ts", "product.mjs"],
  ]) {
    let code = ts.transpileModule(
      fs.readFileSync(path.join(root, src), "utf8"),
      {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2020,
        },
      },
    ).outputText;
    code = code
      .replaceAll(/["']three\/addons\/([^"']+)["']/g, (_, p) =>
        JSON.stringify(
          pathToFileURL(path.join(root, "node_modules/three/examples/jsm", p))
            .href,
        ),
      )
      .replaceAll(
        /["']three["']/g,
        JSON.stringify(
          pathToFileURL(
            path.join(root, "node_modules/three/build/three.module.js"),
          ).href,
        ),
      )
      .replaceAll(
        /["']@\/components\/configurator\/configuration["']/g,
        JSON.stringify(
          pathToFileURL(path.join(temporary, "configuration.mjs")).href,
        ),
      );
    fs.writeFileSync(path.join(temporary, name), code);
  }
  const { createProduct, applyOpening } = await import(
      pathToFileURL(path.join(temporary, "product.mjs")).href
    ),
    { defaults, models } = await import(
      pathToFileURL(path.join(temporary, "configuration.mjs")).href
    );
  const bytes = fs.readFileSync(
      path.join(root, "public/assets/configurator/rigat-parts.glb"),
    ),
    kit = (
      await new GLTFLoader().parseAsync(
        bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength,
        ),
        "",
      )
    ).scene;
  globalThis.document = {
    createElement: () => ({
      width: 64,
      height: 64,
      getContext: () => ({
        fillRect() {},
        beginPath() {},
        arc() {},
        fill() {},
      }),
    }),
  };
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((result) => {
        this.result = result;
        this.onloadend?.();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((result) => {
        this.result =
          "data:application/octet-stream;base64," +
          Buffer.from(result).toString("base64");
        this.onloadend?.();
      });
    }
  };
  const outIndex = process.argv.indexOf("--export"),
    output = outIndex >= 0 ? process.argv[outIndex + 1] : null;
  if (output) fs.mkdirSync(output, { recursive: true });
  for (const model of models) {
    for (const [width, height] of [
      [3000, 2800],
      [800, 1000],
      [6000, 5000],
    ]) {
      const c = {
        ...defaults,
        model: model.id,
        width,
        height,
        colors: { ...defaults.colors },
      };
      if (model.id === "sectionnelle")
        Object.keys(c.colors).forEach((k) => (c.colors[k] = "blanc"));
      const p = createProduct(kit, c);
      let vertices = 0;
      p.group.traverse((o) => {
        if (o.isMesh) {
          vertices += o.geometry.attributes.position.count;
          for (const n of o.geometry.attributes.position.array)
            if (!Number.isFinite(n))
              throw Error("Invalid geometry " + model.id);
        }
      });
      const size = new T.Box3().setFromObject(p.group).getSize(new T.Vector3());
      if (size.x < width / 1000 || size.x > width / 1000 + 0.5)
        throw Error("Wrong width");
      const bottom = p.moving.at(-1),
        start = bottom.object.position.clone();
      applyOpening(p.moving, height / 1000, 0.5);
      if (bottom.object.position.y <= start.y)
        throw Error("Bottom rail did not move");
      applyOpening(p.moving, height / 1000, 1);
      if (bottom.object.position.y < height / 1000 - 0.1)
        throw Error("Opening incomplete");
      applyOpening(p.moving, height / 1000, 0);
      if (start.distanceTo(bottom.object.position) > 0.001)
        throw Error("Closing not reversible");
      if (output && width === 3000) {
        p.group.traverse((o) => {
          if (o.isMesh && o.material.alphaMap) o.material.alphaMap = null;
        });
        fs.writeFileSync(
          path.join(output, model.id + ".glb"),
          Buffer.from(
            await new GLTFExporter().parseAsync(p.group, { binary: true }),
          ),
        );
      }
      p.update({
        ...c,
        housing: "arrondi",
        colors: {
          curtain: "noir",
          bottom: "blanc",
          guides: "acier",
          housing: "noir",
        },
      });
      applyOpening(p.moving, height / 1000, 0);
      p.dispose();
      console.log(
        `${model.id} ${width}×${height}: ${vertices} vertices; dimensions, finishes and opening passed`,
      );
    }
  }
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
