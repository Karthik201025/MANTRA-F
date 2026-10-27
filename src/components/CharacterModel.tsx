"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import type { Group, Mesh, PerspectiveCamera } from "three";
import { Box3, Vector3 } from "three";
import { useThree } from "@react-three/fiber";

const defaultFit = {
  height: 2.7,
  margin: 2.2,
  distanceScale: 1,
};

const modelFits: Record<string, Partial<typeof defaultFit>> = {
  "lego_spiderman.glb": { margin: 4.8 },
  "lego_iron_man.glb": { margin: 15 },
  "lego_batman_minifigure.glb": { margin: 3 },
  "LEGO_-_Captain_America_(Avengers_1).glb": { height: 2.65, margin: 10 },
  "superman_lego.glb": { height: 2.65, margin: 0.8 },
};

function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<Group>(null);
  const get = useThree((state) => state.get);
  const viewport = useThree((state) => state.size);
  const fileName = decodeURIComponent(url.split("/").pop() ?? "");
  const fit = { ...defaultFit, ...modelFits[fileName] };

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const fitModel = () => {
      const camera = get().camera as PerspectiveCamera;
      group.scale.setScalar(1);
      group.position.set(0, 0, 0);
      group.rotation.set(0, 0, 0);
      model.updateMatrixWorld(true);
      const bounds = new Box3();
      model.traverse((object) => {
        const mesh = object as Mesh;
        if (!mesh.isMesh || !mesh.geometry) return;
        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
        if (!mesh.geometry.boundingBox) return;
        bounds.expandByObject(mesh);
      });
      if (bounds.isEmpty()) bounds.setFromObject(model);
      const size = bounds.getSize(new Vector3());
      const center = bounds.getCenter(new Vector3());
      const scale = fit.height / Math.max(size.y, 0.001);
      const normalizedSize = size.multiplyScalar(scale);
      const normalizedMinY = bounds.min.y * scale;
      const targetY = normalizedSize.y / 2;
      const verticalFov = (camera.fov * Math.PI) / 180;
      const aspect = Math.max(viewport.width / viewport.height, 0.1);
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
      const limitingFov = Math.min(verticalFov, horizontalFov);
      const normalizedRadius = Math.sqrt(
        (normalizedSize.x / 2) ** 2 +
        (normalizedSize.y / 2) ** 2 +
        (normalizedSize.z / 2) ** 2,
      );
      const distance = (normalizedRadius / Math.sin(limitingFov / 2)) * fit.margin * fit.distanceScale;

      group.scale.setScalar(scale);
      group.position.set(-center.x * scale, -normalizedMinY, -center.z * scale);
      camera.position.set(0, targetY, Math.max(distance, 2.2));
      camera.near = 0.01;
      camera.far = Math.max(100, distance * 8);
      camera.lookAt(0, targetY, 0);
      camera.updateProjectionMatrix();
    };

    fitModel();
    const frame = requestAnimationFrame(fitModel);
    return () => cancelAnimationFrame(frame);
  }, [fit.distanceScale, fit.height, fit.margin, get, model, viewport.height, viewport.width]);

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

export function CharacterModel({ url, label }: { url: string; label: string }) {
  return (
    <div className="character-model" role="img" aria-label={`${label} 3D model`}>
      <Canvas camera={{ position: [0, 1.3, 4], fov: 34 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} />
        <Suspense fallback={null}>
          <LoadedModel url={url} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
