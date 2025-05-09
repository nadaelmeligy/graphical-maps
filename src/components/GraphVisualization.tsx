'use client';
import dynamic from 'next/dynamic';
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { NodeData } from '../types/graph';
import { useGraphInteractions } from '../hooks/useGraphInteractions';
import ContextMenu from './graph/ContextMenu';
import NodePropertiesModal from './modals/NodePropertiesModal';
import NodeEditModal from './modals/NodeEditModal';
import NotePopup from './graph/NotePopup';
import ColorLegend from './graph/ColorLegend';
import { schemeCategory10 } from 'd3-scale-chromatic';
import CameraControls from './graph/CameraControls';
import EquationLabel from './graph/EquationLabel';
import SpriteText from 'three-spritetext';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

interface GraphVisualizationProps {
  graphData: {
    nodes: NodeData[];
    links: any[];
  };
  colorProperty: string;
  addNode: (title: string, field: string, properties: Record<string, string>, note?: string) => void;
  addLink: (source: number, target: number) => void;
  updateNode: (nodeId: number, updates: Partial<NodeData>) => void;
  removeNode: (nodeId: number) => void;
  onGraphRefUpdate: (ref: { current: any; isReady: boolean } | null) => void;
  showLinkCount: boolean;
  showCategory: boolean;
  labelType: NodeLabelType;
}

export default function GraphVisualization({ 
  graphData, 
  colorProperty,
  addNode, 
  addLink, 
  updateNode, 
  removeNode,
  onGraphRefUpdate,
  showLinkCount,
  showCategory,
  labelType
}: GraphVisualizationProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'canvas' | 'node';
    nodeId?: number;
  } | null>(null);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [editingNode, setEditingNode] = useState<NodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{ node: NodeData; x: number; y: number } | null>(null);
  const [colorMap, setColorMap] = useState(new Map<string, string>());
  const [isGraphReady, setIsGraphReady] = useState(false);

  const {
    graphRef,
    dragLine,
    edgeCreationSource,
    setEdgeCreationSource,
    handleNodeDragStart,
    handleBackgroundDrag,
    handleNodeDrop,
    configureD3Force,
    handleEngineStop: originalHandleEngineStop,
    dimensions
  } = useGraphInteractions(addLink);

  const handleEngineStop = () => {
    originalHandleEngineStop();
    if (!isGraphReady) {
      setIsGraphReady(true);
    }
  };

  // Update when the graph ref changes
  useEffect(() => {
    if (graphRef.current && onGraphRefUpdate) {
      onGraphRefUpdate({ current: graphRef.current, isReady: isGraphReady });
    }
    return () => {
      if (onGraphRefUpdate) {
        onGraphRefUpdate(null);
      }
    };
  }, [graphRef, onGraphRefUpdate, isGraphReady]);

  useEffect(() => {
    // Debug log to check links
    console.log('Current links:', graphData.links);
    if (graphRef.current) {
      graphRef.current.d3ReheatSimulation();
    }
  }, [graphData.links]);

  // Create properly formatted links array
  const processedLinks = useMemo(() => {
    return graphData.links.map(link => ({
      ...link,
      // Ensure source and target are numbers
      source: typeof link.source === 'object' ? link.source.id : link.source,
      target: typeof link.target === 'object' ? link.target.id : link.target
    }));
  }, [graphData.links]);

  const handleNodeClick = (node: NodeData, event: MouseEvent) => {
    if (edgeCreationSource !== null) {
      if (edgeCreationSource !== node.id) {
        addLink(edgeCreationSource, node.id);
      }
      setEdgeCreationSource(null);
      return;
    }

    // Check for URL and open in new tab if available
    if (node.url) {
      window.open(node.url, '_blank');
      return;
    }

    // Show context menu if no URL
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

  // Create a memoized color map
  const colorMapping = useMemo(() => {
    const uniqueValues = new Set(graphData.nodes.map(node => node.__colorKey));
    const colorMap = new Map<string, string>();
    Array.from(uniqueValues).forEach((value, index) => {
      colorMap.set(value, schemeCategory10[index % schemeCategory10.length]);
    });
    setColorMap(colorMap);
    return colorMap;
  }, [graphData.nodes]);

  const resetCamera = useCallback(() => {
    if (graphRef.current) {
      // Get graph center and size
      const distanceToCenter = Math.cbrt(graphData.nodes.length) * 150;
      graphRef.current.cameraPosition(
        { x: distanceToCenter, y: distanceToCenter, z: distanceToCenter }, // new position
        { x: 0, y: 0, z: 0 }, // lookAt center
        3000 // transition duration
      );
    }
  }, [graphData.nodes.length]);

  const updateNodeLabels = useCallback(() => {
    if (!graphRef.current || !graphData.nodes) return;

    graphData.nodes.forEach(node => {
      if (!node.labelConfig) {
        node.labelConfig = { type: labelType };
      }
      node.labelConfig.type = labelType;
    });

    // Force a re-render
    graphRef.current.refresh();
  }, [labelType, graphData.nodes]);

  useEffect(() => {
    updateNodeLabels();
  }, [labelType, updateNodeLabels]);

  const getNodeLabel = (node: NodeData) => {
    const labelType = node.labelConfig?.type || 'none';
    
    switch (labelType) {
      case 'none':
        return '';
      case 'title':
        return node.title;
      case 'category':
        return node.field;
      case 'equation':
        if (!node.equation) return '';
        return node.equation;
      case 'note':
        return node.note || '';
      case 'url':
        return node.url || '';
      default:
        // Handle custom properties
        return node.properties[labelType] || '';
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <button
        onClick={resetCamera}
        className="absolute top-4 right-4 z-10 px-1.5 py-1 bg-gray-800 text-white rounded-md 
                   hover:bg-gray-700 transition-colors shadow-lg"
      >
        Reset View
      </button>

      <CameraControls graphRef={graphRef} />

      <ForceGraph3D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={{
          nodes: graphData.nodes,
          // Use processed links instead of direct graphData.links
          links: [
            ...processedLinks, 
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
        nodeAutoColorBy={(node: any) => node.__colorKey}
        nodeColor={(node: any) => colorMapping.get(node.__colorKey)}
        linkOpacity={1} // Increase opacity
        linkWidth={3} // Increase width
        linkColor={() => '#94a3b8'} // Consistent color for all non-temp links
        linkDirectionalParticles={2} // Add particles for better visibility
        linkDirectionalParticleWidth={4}
        linkCurvature={0} // Disable curvature temporarily to debug
        linkResolution={20}
        nodeVal={(node: any) => (node.__edgeCount || 1) * 2} // Size based on edge count
        nodeLabel={getNodeLabel}
        nodeThreeObject={node => {
          const label = getNodeLabel(node);
          if (!label) return null;

          const sprite = new SpriteText(label);
          sprite.color = '#000000';
          sprite.textHeight = 8;
          sprite.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          sprite.padding = 2;
          sprite.borderRadius = 3;
          return sprite;
        }}
        onNodeClick={handleNodeClick}
        onNodeHover={(node, event) => {
          // Only handle hover if we have a node
          if (!node) {
            setHoveredNode(null);
            return;
          }

          // Get canvas coordinates
          const canvas = graphRef.current?.renderer()?.domElement;
          if (!canvas) return;

          const rect = canvas.getBoundingClientRect();
          
          // Try to get coordinates from different event object structures
          let x = rect.left;
          let y = rect.top;

          if (typeof event === 'object' && event !== null) {
            if ('clientX' in event && 'clientY' in event) {
              // MouseEvent-like object
              x = (event as MouseEvent).clientX;
              y = (event as MouseEvent).clientY;
            } else if ('x' in event && 'y' in event) {
              // Object with x/y properties
              x = rect.left + (event as {x: number}).x;
              y = rect.top + (event as {y: number}).y;
            }
          }

          setHoveredNode({ 
            node: node as NodeData, 
            x, 
            y 
          });
        }}
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

      <ColorLegend 
        colorMap={colorMap}
        title={`Color by ${colorProperty === 'field' ? 'Category' : colorProperty}`}
      />

      {hoveredNode?.node?.note && (
        <NotePopup
          note={hoveredNode.node.note}
          x={hoveredNode.x}
          y={hoveredNode.y}
        />
      )}

      {/* Only show equation labels if not already showing as node labels */}
      {labelType !== 'equation' && graphData.nodes.map(node => 
        node.equation ? (
          <EquationLabel
            key={`eq-${node.id}`}
            equation={node.equation}
            position={{ x: node.x || 0, y: node.y || 0, z: node.z || 0 }}
            graphRef={graphRef}
          />
        ) : null
      )}

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
          onSave={({ title, field, properties, note }) => {
            addNode(title, field, properties, note);
            setShowNodeModal(false);
          }}
        />
      )}
    </div>
  );
}
