'use client';
import dynamic from 'next/dynamic';
import { useState, useRef } from 'react';
import type { NodeData } from '../types/graph';
import ContextMenu from './ContextMenu';
import NodePropertiesModal from './NodePropertiesModal';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

interface GraphVisualizationProps {
  graphData: any;
  addNode: (title: string, field: string, properties: Record<string, string>) => void;
  addLink: (source: number, target: number) => void;
}

export default function GraphVisualization({ graphData, addNode, addLink }: GraphVisualizationProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'canvas' | 'node';
    nodeId?: number;
  } | null>(null);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [dragLine, setDragLine] = useState<{ source: number; x: number; y: number; z: number } | null>(null);
  const graphRef = useRef<any>();
  const [isSimulationRunning, setSimulationRunning] = useState(true);
  const [edgeCreationSource, setEdgeCreationSource] = useState<number | null>(null);

  const handleNodeClick = (node: NodeData, event: MouseEvent) => {
    if (edgeCreationSource !== null) {
      // Complete edge creation
      if (edgeCreationSource !== node.id) {
        addLink(edgeCreationSource, node.id);
      }
      setEdgeCreationSource(null);
      return;
    }

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      type: 'node',
      nodeId: node.id
    });
  };

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
      // Briefly reheat simulation when adding edge
      if (graphRef.current) {
        graphRef.current.d3ReheatSimulation();
        setTimeout(() => graphRef.current?.d3Force('center')?.strength(0), 1000);
      }
    }
    setDragLine(null);
  };

  const startEdgeCreation = (nodeId: number) => {
    setEdgeCreationSource(nodeId);
    setContextMenu(null);
  };

  return (
    <>
      <ForceGraph3D
        ref={graphRef}
        graphData={{
          nodes: graphData.nodes,
          links: [...graphData.links, 
            ...(dragLine ? [{
              source: dragLine.source,
              target: { x: dragLine.x, y: dragLine.y, z: dragLine.z }
            }] : []),
            ...(edgeCreationSource !== null ? [{
              source: edgeCreationSource,
              target: { x: 0, y: 0, z: 0 }, // Will be updated by mouse position
              __temp: true // Mark as temporary
            }] : [])
          ]
        }}
        nodeAutoColorBy="field"
        linkOpacity={0.3}
        linkWidth={1.5}
        linkColor={link => (link as any).__temp ? '#ff0000' : '#94a3b8'}
        nodeLabel={(n: any) => `${n.title} — ${n.field}`}
        onNodeClick={handleNodeClick}
        onNodeDragStart={handleNodeDragStart}
        onNodeDrag={handleBackgroundDrag}
        onNodeDragEnd={handleNodeDrop}
        onBackgroundClick={() => setShowNodeModal(true)}
        enableNodeDrag={true}
        forceEngine="d3"
        cooldownTicks={50}
        d3Force={(d3) => {
          d3.force('charge')?.strength(-50);
          d3.force('link')?.distance(100);
          d3.force('center')?.strength(isSimulationRunning ? 0.05 : 0);
          d3.force('collision')?.radius(20);
        }}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.d3Force('charge', null);
            graphRef.current.d3Force('center', null);
            graphRef.current.d3Force('collision', null);
          }
          setSimulationRunning(false);
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          options={contextMenu.type === 'node' ? [
            { label: 'Edit Node', action: () => {/* TODO */} },
            { label: 'Remove Node', action: () => {/* TODO */} },
            { label: 'Create Edge from Here', action: () => startEdgeCreation(contextMenu.nodeId!) }
          ] : []}
        />
      )}

      {edgeCreationSource !== null && (
        <div className="fixed top-0 left-0 w-full p-4 bg-blue-500 text-white text-center">
          Click on another node to create an edge. Press ESC to cancel.
        </div>
      )}

      {showNodeModal && (
        <NodePropertiesModal
          onClose={() => setShowNodeModal(false)}
          onSave={({ title, field, properties }) => {
            addNode(title, field, properties);
            setShowNodeModal(false);
          }}
        />
      )}
    </>
  );
}
