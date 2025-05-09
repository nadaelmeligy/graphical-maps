'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface EquationLabelProps {
  equation: string;
  position: { x: number; y: number; z: number };
  graphRef: any;
}

export default function EquationLabel({ equation, position, graphRef }: EquationLabelProps) {
  const labelRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!labelRef.current || !graphRef?.current) return;

    const vector = new THREE.Vector3(position.x, position.y, position.z);
    const camera = graphRef.current.camera();
    vector.project(camera);

    const canvas = graphRef.current.renderer().domElement;
    const x = ((vector.x + 1) / 2) * canvas.width;
    const y = ((-vector.y + 1) / 2) * canvas.height;

    labelRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  };

  useEffect(() => {
    if (!labelRef.current) return;

    try {
      katex.render(equation, labelRef.current, {
        throwOnError: false,
        displayMode: true,
        strict: false,
        trust: true
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      if (labelRef.current) {
        labelRef.current.textContent = equation;
      }
    }

    const animate = () => {
      updatePosition();
      requestAnimationFrame(animate);
    };

    animate();
  }, [equation, position]);

  return (
    <div
      ref={labelRef}
      className="absolute top-0 left-0 bg-white bg-opacity-80 p-2 rounded shadow-md text-sm z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
}
