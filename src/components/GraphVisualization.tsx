'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { NodeData } from '../types/graph';
import { useGraphInteractions } from '../hooks/useGraphInteractions';
import ContextMenu from './ContextMenu';
import NodePropertiesModal from './NodePropertiesModal';
import NodeEditModal from './NodeEditModal';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

interface GraphVisualizationProps {
  graphData: any;
  addNode: (title: string, field: string, properties: Record<string, string>) => void;
  addLink: (source: number, target: number) => void;
  updateNode: (nodeId: number, updates: Partial<NodeData>) => void;
  removeNode: (nodeId: number) => void;
}

export default function GraphVisualization({ 
  graphData, 
  addNode, 
  addLink, 
  updateNode, 
  removeNode 
}: GraphVisualizationProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'canvas' | 'node';
    nodeId?: number;
  } | null>(null);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [editingNode, setEditingNode] = useState<NodeData | null>(null);

  const {
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
  } = useGraphInteractions(addLink);

  const handleNodeClick = (node: NodeData, event: MouseEvent) => {
    if (edgeCreationSource !== null) {
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

  const startEdgeCreation = (nodeId: number) => {
    setEdgeCreationSource(nodeId);
    setContextMenu(null);
  };

  const handleRemoveNode = (nodeId: number) => {
    try {
      removeNode(nodeId);
    } catch (error) {
      console.error('Error removing node:', error);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ForceGraph3D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={{
          nodes: graphData.nodes,
          links: [...graphData.links, 
            ...(dragLine ? [{
              source: dragLine.source,
              target: { x: dragLine.x, y: dragLine.y, z: dragLine.z }
            }] : []),
            ...(edgeCreationSource !== null ? [{
              source: edgeCreationSource,
              target: { x: 0, y: 0, z: 0 },
              __temp: true
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
        d3Force={configureD3Force}
        onEngineStop={handleEngineStop}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0
        }}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          options={contextMenu.type === 'node' ? [
            { 
              label: 'Edit Node', 
              action: () => {
                const node = graphData.nodes.find(n => n.id === contextMenu.nodeId);
                if (node) setEditingNode(node);
                setContextMenu(null);
              }
            },
            { 
              label: 'Remove Node', 
              action: () => {
                if (contextMenu.nodeId !== undefined) {
                  handleRemoveNode(contextMenu.nodeId);
                  setContextMenu(null);
                }
              }
            },
            { 
              label: 'Create Edge from Here', 
              action: () => startEdgeCreation(contextMenu.nodeId!)
            }
          ] : []}
        />
      )}

      {edgeCreationSource !== null && (
        <div className="fixed top-0 left-0 w-full p-4 bg-blue-500 text-white text-center">
          Click on another node to create an edge. Press ESC to cancel.
        </div>
      )}

      {editingNode && (
        <NodeEditModal
          node={editingNode}
          existingNodes={graphData.nodes}
          onClose={() => setEditingNode(null)}
          onSave={(updates) => {
            updateNode(editingNode.id, updates);
            setEditingNode(null);
          }}
        />
      )}

      {showNodeModal && (
        <NodePropertiesModal
          existingNodes={graphData.nodes}
          onClose={() => setShowNodeModal(false)}
          onSave={({ title, field, properties }) => {
            addNode(title, field, properties);
            setShowNodeModal(false);
          }}
        />
      )}
    </div>
  );
}
