"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroWave() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 3.8, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const cols = 130;
    const rows = 72;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const deep = new THREE.Color("#0a4564");
    const aqua = new THREE.Color("#8fffe0");

    let i = 0;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const nx = x / (cols - 1) - 0.5;
        const ny = y / (rows - 1) - 0.5;
        const px = nx * 15;
        const pz = ny * 8.5;
        base[i * 3] = px;
        base[i * 3 + 1] = 0;
        base[i * 3 + 2] = pz;
        positions.set([px, 0, pz], i * 3);

        const c = deep.clone().lerp(aqua, Math.max(0, 1 - Math.abs(nx) * 1.5) * (0.3 + y / rows * 0.7));
        colors.set([c.r, c.g, c.b], i * 3);
        i += 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      transparent: true,
      opacity: 0.72,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.x = -0.37;
    points.position.y = -1.1;
    scene.add(points);

    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frame = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = reduceMotion ? 2.5 : clock.getElapsedTime();
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      for (let p = 0; p < count; p += 1) {
        const x = base[p * 3];
        const z = base[p * 3 + 2];
        const swell = Math.sin(x * 0.72 - t * 1.15) * 0.38;
        const chop = Math.sin(z * 1.6 + x * 0.25 + t * 0.78) * 0.16;
        const crest = Math.exp(-Math.pow(x + 1.3, 2) * 0.1) * Math.sin(z * 0.58 - t) * 0.42;
        pos.setY(p, swell + chop + crest);
      }
      pos.needsUpdate = true;

      points.rotation.z += ((pointerX * 0.08) - points.rotation.z) * 0.025;
      camera.position.x += ((pointerX * 0.8) - camera.position.x) * 0.018;
      camera.position.y += ((3.8 - pointerY * 0.45) - camera.position.y) * 0.018;
      camera.lookAt(0, -0.2, 0);
      renderer.render(scene, camera);
      if (!reduceMotion) frame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("pointermove", onPointer);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="hero-wave" aria-hidden="true" />;
}
