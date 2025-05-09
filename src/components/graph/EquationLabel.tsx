'use client';
import { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';

interface EquationLabelProps {
  equation: string;
  position: { x: number; y: number; z: number };
  graphRef: any;
}

export default function EquationLabel({ equation, position, graphRef }: EquationLabelProps) {
  const labelRef = useRef<HTMLDivElement>(null);
  const [screenPosition, setScreenPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (!graphRef?.current) return;
      
      // Convert 3D position to screen coordinates
      const vector = new THREE.Vector3(position.x, position.y, position.z);
      const camera = graphRef.current.camera();
      vector.project(camera);
      
      // Convert to pixel coordinates
      const canvas = graphRef.current.renderer().domElement;
      setScreenPosition({
        x: ((vector.x + 1) / 2) * canvas.width,
        y: ((-vector.y + 1) / 2) * canvas.height
      });
    };

    // Render equation
    const renderEquation = async () => {
      if (labelRef.current && equation) {
        try {
          const katex = (await import('katex')).default;
          katex.render(equation, labelRef.current, {
            throwOnError: false,
            displayMode: true,
            output: 'html',
            strict: false
          });
        } catch (error) {
          console.error('LaTeX rendering error:', error);
        }
      }
    };

    renderEquation();
    updatePosition();

    // Add event listeners for camera movement
    const canvas = graphRef?.current?.renderer()?.domElement;
    if (canvas) {
      canvas.addEventListener('mousedown', updatePosition);
      canvas.addEventListener('mouseup', updatePosition);
      canvas.addEventListener('mousemove', updatePosition);
    }

    // Cleanup
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', updatePosition);
        canvas.removeEventListener('mouseup', updatePosition);
        canvas.removeEventListener('mousemove', updatePosition);
      }
    };
  }, [equation, position, graphRef]);

  return (
    <div
      ref={labelRef}
      style={{
        position: 'absolute',
        left: `${screenPosition.x}px`,
        top: `${screenPosition.y}px`,
        transform: 'translate(20px, -50%)', // Offset from node
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
        maxWidth: '300px',
        overflowX: 'auto',
        pointerEvents: 'none' // Prevent interference with graph interaction
      }}
      className="equation-label"
    />
  );
}
