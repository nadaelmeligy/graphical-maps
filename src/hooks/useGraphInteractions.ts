import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { NodeData } from '../types/graph';

export function useGraphInteractions(
  addLink: (source: number, target: number) => void,
  layout?: string,
  linkDistance: number = 100,
  chargeStrength: number = -50
) {
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

  const configureD3Force = (d3Sim: any) => {
    if (!d3Sim) return;

    // Create forces first
    const linkForce = d3.forceLink().id((d: any) => d.id).distance(linkDistance);
    const chargeForce = d3.forceManyBody().strength(chargeStrength);
    const centerForce = d3.forceCenter();

    // Assign forces with proper strength values
    d3Sim
      .force('link', linkForce)
      .force('charge', chargeForce)
      .force('center', centerForce);

    switch (layout) {
      case 'radial':
        const radialForce = d3.forceRadial(200);
        d3Sim
          .force('radial', radialForce.strength(0.8))
          .force('charge', chargeForce.strength(chargeStrength * 0.7))
          .force('center', centerForce.strength(1));
        break;
      
      case 'hierarchical':
        d3Sim
          .force('charge', chargeForce.strength(chargeStrength * 1.5))
          .force('y', d3.forceY().strength(0.3))
          .force('x', d3.forceX().strength(0.1))
          .force('center', centerForce.strength(0.5));
        break;

      case 'circular':
        const circularForce = d3.forceRadial(200);
        d3Sim
          .force('radial', circularForce.strength(1))
          .force('charge', chargeForce.strength(chargeStrength * 0.5))
          .force('center', centerForce.strength(1));
        break;

      default: // force-directed
        d3Sim
          .force('charge', chargeForce.strength(chargeStrength))
          .force('center', centerForce.strength(0.1))
          .force('collision', d3.forceCollide(30));
        break;
    }

    // Reheat simulation
    d3Sim.alpha(1).restart();
  };

  // Apply configuration when layout changes
  useEffect(() => {
    if (graphRef.current) {
      configureD3Force(graphRef.current.d3Force());
    }
  }, [layout, linkDistance, chargeStrength]);

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
