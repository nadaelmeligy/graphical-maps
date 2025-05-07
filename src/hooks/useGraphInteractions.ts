import { useState, useRef, useEffect } from 'react';
import type { NodeData } from '../types/graph';

export function useGraphInteractions(addLink: (source: number, target: number) => void) {
  const [dragLine, setDragLine] = useState<{ source: number; x: number; y: number; z: number } | null>(null);
  const [isSimulationRunning, setSimulationRunning] = useState(true);
  const [edgeCreationSource, setEdgeCreationSource] = useState<number | null>(null);
  const graphRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 80 // Account for header/navbar height
      });
    };

    window.addEventListener('resize', updateDimensions);
    // Initial call
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleNodeDragStart = (node: NodeData, event: MouseEvent) => {
    setDragLine({ source: node.id, x: event.clientX, y: event.clientY, z: 0 });
  };

  const handleBackgroundDrag = (event: MouseEvent) => {
    if (dragLine && graphRef.current) {
      const { x, y } = graphRef.current.screen2GraphCoords(event.clientX, event.clientY);
      setDragLine(prev => prev ? { ...prev, x, y, z: 0 } : null);
    }
  };

  const handleNodeDrop = (node: NodeData) => {
    if (dragLine && node.id !== dragLine.source) {
      addLink(dragLine.source, node.id);
      if (graphRef.current) {
        graphRef.current.d3ReheatSimulation();
        setTimeout(() => graphRef.current?.d3Force('center')?.strength(0), 1000);
      }
    }
    setDragLine(null);
  };

  const configureD3Force = (d3: any) => {
    d3.force('charge')?.strength(-50);
    d3.force('link')?.distance(100);
    d3.force('center')?.strength(isSimulationRunning ? 0.05 : 0);
    d3.force('collision')?.radius(20);
  };

  const handleEngineStop = () => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge', null);
      graphRef.current.d3Force('center', null);
      graphRef.current.d3Force('collision', null);
    }
    setSimulationRunning(false);
  };

  return {
    graphRef,
    dragLine,
    edgeCreationSource,
    setEdgeCreationSource,
    handleNodeDragStart,
    handleBackgroundDrag,
    handleNodeDrop,
    configureD3Force,
    handleEngineStop,
    dimensions
  };
}
