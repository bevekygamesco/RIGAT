"use client";
import { useEffect, useRef, useState } from "react";
import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createProduct, applyOpening } from "@/lib/configurator/product";
import { Configuration, models } from "./configuration";
type Props = {
  configuration: Configuration;
  open: boolean;
  resetKey: number;
  zoom: number;
  turn: number;
  dimensions: boolean;
  onFailure?: () => void;
};
type Engine = {
  update: (c: Configuration) => void;
  setOpen: (o: boolean) => void;
  reset: () => void;
  zoom: (z: number) => void;
  rotate: (a: number) => void;
  dispose: () => void;
};
export default function Viewer({
  configuration,
  open,
  resetKey,
  zoom,
  turn,
  dimensions,
  onFailure,
}: Props) {
  const host = useRef<HTMLDivElement>(null),
    engine = useRef<Engine | null>(null),
    current = useRef(configuration),
    lastTurn = useRef(turn);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  current.current = configuration;
  useEffect(() => {
    if (!host.current) return;
    const mount = host.current;
    let cancelled = false,
      renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      setStatus("error");
      onFailure?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.localClippingEnabled = true;
    renderer.domElement.setAttribute(
      "aria-label",
      "Modèle 3D interactif : faites glisser pour tourner, utilisez les boutons pour zoomer",
    );
    renderer.domElement.setAttribute("role", "img");
    mount.appendChild(renderer.domElement);
    const scene = new T.Scene(),
      camera = new T.PerspectiveCamera(35, 1, 0.1, 60);
    camera.position.set(5, 3.5, 7.4);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI * 0.53;
    controls.target.set(0, 1.5, 0);
    const pmrem = new T.PMREMGenerator(renderer),
      room = new RoomEnvironment(),
      environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    scene.add(new T.HemisphereLight(0xf1f7ff, 0xa4b3cc, 2));
    const key = new T.DirectionalLight(0xffffff, 4);
    key.position.set(-3, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, {
      left: -7,
      right: 7,
      top: 8,
      bottom: -5,
    });
    key.shadow.normalBias = 0.025;
    key.shadow.bias = -0.0002;
    scene.add(key);
    const rim = new T.DirectionalLight(0xb7d7ff, 2.2);
    rim.position.set(4, 3, -4);
    scene.add(rim);
    const floor = new T.Mesh(
      new T.PlaneGeometry(40, 40),
      new T.ShadowMaterial({ opacity: 0.16 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.015;
    floor.receiveShadow = true;
    scene.add(floor);
    let product: ReturnType<typeof createProduct> | null = null,
      kit: T.Group | null = null,
      config = current.current;
    let raf = 0,
      last = 0,
      progress = 0,
      target = 0,
      visible = true,
      dirty = 60,
      baseDistance = 9,
      lastZoom = 1;
    function update(c: Configuration) {
      config = c;
      if (!kit) return;
      if (product) product.update(c);
      else {
        product = createProduct(kit, c);
        scene.add(product.group);
      }
      const w = c.width / 1000,
        h = c.height / 1000,
        size = Math.max(w, h + 0.5);
      baseDistance = size * 2.05;
      controls.target.set(0, (h + 0.35) / 2, -0.08);
      controls.minDistance = size * 1.2;
      controls.maxDistance = size * 3;
      const direction = camera.position
        .clone()
        .sub(controls.target)
        .normalize();
      camera.position
        .copy(controls.target)
        .add(direction.multiplyScalar(baseDistance / lastZoom));
      controls.update();
      dirty = 60;
    }
    function reset() {
      const h = config.height / 1000;
      camera.position
        .set(1, 0.43, 1.55)
        .normalize()
        .multiplyScalar(baseDistance / lastZoom)
        .add(new T.Vector3(0, (h + 0.35) / 2, -0.08));
      controls.target.set(0, (h + 0.35) / 2, -0.08);
      controls.update();
      dirty = 60;
    }
    function disposeKit(g: T.Group) {
      g.traverse((o) => {
        if (o instanceof T.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(
            (m: T.Material) => m.dispose(),
          );
        }
      });
    }
    new GLTFLoader().load(
      "/assets/configurator/rigat-parts.glb",
      (g) => {
        if (cancelled) {
          disposeKit(g.scene);
          return;
        }
        kit = g.scene;
        try {
          update(current.current);
          reset();
          setStatus("ready");
        } catch {
          setStatus("error");
          onFailure?.();
        }
      },
      undefined,
      () => {
        if (!cancelled) {
          setStatus("error");
          onFailure?.();
        }
      },
    );
    function resize() {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      dirty = 60;
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();
    const observer = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      dirty = 60;
    });
    observer.observe(mount);
    controls.addEventListener("change", () => {
      dirty = 60;
    });
    function frame(time: number) {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        last = time;
        return;
      }
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      const next = window.matchMedia("(prefers-reduced-motion:reduce)").matches
        ? target
        : T.MathUtils.damp(progress, target, 5, dt);
      if (Math.abs(next - progress) > 0.0001) {
        progress = next;
        dirty = 60;
      } else progress = target;
      controls.update();
      if (dirty > 0) {
        if (product)
          applyOpening(product.moving, config.height / 1000, progress);
        renderer.render(scene, camera);
        dirty--;
      }
    }
    raf = requestAnimationFrame(frame);
    renderer.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      setStatus("error");
      onFailure?.();
    });
    engine.current = {
      update,
      setOpen: (o) => {
        target = o ? 1 : 0;
        dirty = 60;
      },
      reset,
      zoom: (z) => {
        lastZoom = z;
        camera.position
          .sub(controls.target)
          .normalize()
          .multiplyScalar(baseDistance / z)
          .add(controls.target);
        dirty = 60;
      },
      rotate: (a) => {
        camera.position
          .sub(controls.target)
          .applyAxisAngle(new T.Vector3(0, 1, 0), a)
          .add(controls.target);
        controls.update();
        dirty = 60;
      },
      dispose: () => {
        cancelled = true;
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        observer.disconnect();
        controls.dispose();
        product?.dispose();
        if (kit) disposeKit(kit);
        environment.dispose();
        floor.geometry.dispose();
        floor.material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      },
    };
    return () => {
      engine.current?.dispose();
      engine.current = null;
    };
    // The WebGL scene is created once; selections update its product geometry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    engine.current?.update(configuration);
  }, [configuration]);
  useEffect(() => {
    engine.current?.setOpen(open);
  }, [open]);
  useEffect(() => {
    engine.current?.reset();
  }, [resetKey]);
  useEffect(() => {
    engine.current?.zoom(zoom);
  }, [zoom]);
  useEffect(() => {
    engine.current?.rotate(turn - lastTurn.current);
    lastTurn.current = turn;
  }, [turn]);
  return (
    <div className="cfg-viewer-shell">
      <div className="cfg-webgl" ref={host} />
      {status === "loading" && (
        <div className="cfg-viewer-loading" role="status">
          <span />
          Préparation de votre modèle 3D…
        </div>
      )}
      {status === "error" && (
        <div className="cfg-viewer-error">
          <img
            src={`/assets/mobile-models/${configuration.model}.webp`}
            alt={models.find((m) => m.id === configuration.model)!.name}
          />
          <p>
            La vue 3D est indisponible sur cet appareil. Vos options restent
            accessibles.
          </p>
        </div>
      )}
      {dimensions && (
        <div className="cfg-dimensions" aria-hidden="true">
          <span className="cfg-width">
            ↔ {configuration.width.toLocaleString("fr-FR")} mm
          </span>
          <span className="cfg-height">
            ↕ {configuration.height.toLocaleString("fr-FR")} mm
          </span>
        </div>
      )}
    </div>
  );
}
