import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas as R3FCanvas } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box3,
  Layers,
  PerspectiveCamera as PC,
  Vector3,
  Vector3Tuple,
} from 'three';
import { useSearchParams } from 'react-router-dom';
import { Selection } from './selection.tsx';
import { SceneLoader } from './scene-loader.tsx';

const layers = new Layers();
layers.enableAll();

const V1 = new Vector3();

const defaultFocalPoint: { grid: Vector3Tuple; objectCenter: Vector3Tuple } = {
  grid: [0, 0, 0],
  objectCenter: [0, 0, 0],
};

export function Canvas() {
  const [searchParams] = useSearchParams();
  const path = searchParams.get('path') || '';
  const [focalPoint, setFocalPoint] = useState(defaultFocalPoint);
  const { target, position } = useMemo(() => {
    const actualCameraPosition: Vector3Tuple = [...focalPoint.objectCenter];
    actualCameraPosition[1] += 2;
    actualCameraPosition[2] += 7;
    return { target: focalPoint.objectCenter, position: actualCameraPosition };
  }, [focalPoint]);
  const camera = useRef<PC>(null);

  const onFocusObject = (point: Vector3Tuple, box: Box3) => {
    const center = box.getCenter(V1);
    setFocalPoint({
      objectCenter: center.toArray(),
      grid: [point[0], 0, point[2]],
    });
  };

  useEffect(() => {
    if (path) {
      window.document.title = path.split('/').at(-1) + ' • TRIPLEX';
      fetch(`http://localhost:8000/scene/open?path=${path}&cwd=${__CWD__}`);
    }
  }, [path]);

  useEffect(() => {
    if (!path) {
      return;
    }

    const callback = (e: KeyboardEvent) => {
      if (
        e.keyCode === 83 &&
        (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
        fetch(`http://localhost:8000/scene/save?path=${path}`);
      }
    };

    document.addEventListener('keydown', callback);

    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [path]);

  return (
    <R3FCanvas gl={{ antialias: false }} shadows id='editor-canvas'>
      <PerspectiveCamera
        ref={camera}
        makeDefault
        layers={layers}
        position={position}
      />
      <OrbitControls makeDefault target={target} />
      <Selection onFocus={onFocusObject}>
        <Suspense fallback={null}>{path && <SceneLoader />}</Suspense>
      </Selection>

      <gridHelper position={focalPoint.grid} />
    </R3FCanvas>
  );
}
