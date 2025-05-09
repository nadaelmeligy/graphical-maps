import { useEffect } from 'react';
import * as THREE from 'three';

interface CameraControlsProps {
  graphRef: any;
  distance?: number;
  rotationAngle?: number;
  visible?: boolean;
}

export default function CameraControls({
  graphRef,
  distance = 50, // Reduced for finer control
  rotationAngle = Math.PI / 8,
  visible = true
}: CameraControlsProps) {
  if (!visible) return null;

  const movePosition = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!graphRef.current) return;

    const camera = graphRef.current.camera();

    // Simple world-space movement
    switch (direction) {
      case 'up':
        camera.position.y += distance;
        break;
      case 'down':
        camera.position.y -= distance;
        break;
      case 'left':
        camera.position.x -= distance;
        break;
      case 'right':
        camera.position.x += distance;
        break;
    }

    // Don't change where camera is looking
    graphRef.current.renderer().render(graphRef.current.scene(), camera);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!graphRef.current) return;

      // Handle position movement with arrow keys
      if (!e.shiftKey && !e.code === 'Space') {
        switch (e.key) {
          case 'ArrowLeft':
            movePosition('left');
            break;
          case 'ArrowRight':
            movePosition('right');
            break;
          case 'ArrowUp':
            movePosition('up');
            break;
          case 'ArrowDown':
            movePosition('down');
            break;
        }
      }

      // Handle rotation with Space + arrows
      if (e.code === 'Space' && e.key.startsWith('Arrow')) {
        e.preventDefault();
        const camera = graphRef.current.camera();
        
        switch (e.key) {
          case 'ArrowLeft':
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationAngle);
            break;
          case 'ArrowRight':
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotationAngle);
            break;
          case 'ArrowUp':
            camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -rotationAngle);
            break;
          case 'ArrowDown':
            camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotationAngle);
            break;
        }
        graphRef.current.renderer().render(graphRef.current.scene(), camera);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [graphRef, distance, rotationAngle]);

  const moveCamera = (direction: 'left' | 'right' | 'up' | 'down', isRotation = false) => {
    if (!graphRef.current) return;

    const camera = graphRef.current.camera();
    const pos = camera.position;
    const lookAt = { x: 0, y: 0, z: 0 };

    if (isRotation) {
      if (direction === 'left') {
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationAngle);
      } else if (direction === 'right') {
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotationAngle);
      } else if (direction === 'up') {
        camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -rotationAngle);
      } else if (direction === 'down') {
        camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotationAngle);
      }
    } else {
      movePosition(direction);
    }

    graphRef.current.camera().lookAt(lookAt.x, lookAt.y, lookAt.z);
    graphRef.current.renderer().render(graphRef.current.scene(), camera);
  };

  return (
    <>
      {/* Position Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 space-y-2 z-[1000]">
        <div className="flex flex-col items-center gap-1 drop-shadow-lg">
          <button
            onClick={() => moveCamera('up')}
            className="p-2 bg-gray-800 text-white rounded border-2 border-blue-400 
                     hover:bg-gray-700 hover:border-blue-500 transition-colors"
            title="Move Up (↑)"
          >
            ↑
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => moveCamera('left')}
              className="p-2 bg-gray-800 text-white rounded border-2 border-blue-400 
                       hover:bg-gray-700 hover:border-blue-500 transition-colors"
              title="Move Left (←)"
            >
              ←
            </button>
            <button
              onClick={() => moveCamera('right')}
              className="p-2 bg-gray-800 text-white rounded border-2 border-blue-400 
                       hover:bg-gray-700 hover:border-blue-500 transition-colors"
              title="Move Right (→)"
            >
              →
            </button>
          </div>
          <button
            onClick={() => moveCamera('down')}
            className="p-2 bg-gray-800 text-white rounded border-2 border-blue-400 
                     hover:bg-gray-700 hover:border-blue-500 transition-colors"
            title="Move Down (↓)"
          >
            ↓
          </button>
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-2 z-[1000]">
        <div className="flex flex-col items-center gap-1 drop-shadow-lg">
          <button
            onClick={() => moveCamera('up', true)}
            className="p-2 bg-blue-600/80 text-white rounded border-2 border-purple-400 
                     hover:bg-blue-500 hover:border-purple-500 transition-colors"
            title="Rotate Up (Space + ↑)"
          >
            ⟲
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => moveCamera('left', true)}
              className="p-2 bg-blue-600/80 text-white rounded border-2 border-purple-400 
                       hover:bg-blue-500 hover:border-purple-500 transition-colors"
              title="Rotate Left (Space + ←)"
            >
              ↺
            </button>
            <button
              onClick={() => moveCamera('right', true)}
              className="p-2 bg-blue-600/80 text-white rounded border-2 border-purple-400 
                       hover:bg-blue-500 hover:border-purple-500 transition-colors"
              title="Rotate Right (Space + →)"
            >
              ↻
            </button>
          </div>
          <button
            onClick={() => moveCamera('down', true)}
            className="p-2 bg-blue-600/80 text-white rounded border-2 border-purple-400 
                     hover:bg-blue-500 hover:border-purple-500 transition-colors"
            title="Rotate Down (Space + ↓)"
          >
            ⟳
          </button>
        </div>
      </div>
    </>
  );
}
