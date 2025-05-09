import { useState, useEffect, useCallback } from 'react';
import type { GraphData, NodeData, LinkData } from '../types/graph';
import { processImportedGraph } from '../utils/importProcessor';

export function useGraphPersistence() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  // Add a single node
  function addNode(title: string, field: string, properties: Record<string, string> = {}, note?: string, url?: string, color?: string) {
    const nextId = graphData.nodes.length
      ? Math.max(...graphData.nodes.map(n => n.id)) + 1
      : 0;
    const node: NodeData = { id: nextId, title, field, note, properties, url, color };
    setGraphData(g => ({ nodes: [...g.nodes, node], links: g.links }));
  }

  // Add a link between nodes
  function addLink(sourceId: number, targetId: number, edgeType?: EdgeType) {
    if (sourceId === targetId) return; // Prevent self-loops
    
    const newLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: sourceId,
      target: targetId,
      type: edgeType || 'line',
      value: 1  // Add a value property
    };
    
    setGraphData(g => ({
      nodes: g.nodes,
      links: [...g.links, newLink]
    }));
  }

  // Update a node
  function updateNode(nodeId: number, updates: Partial<NodeData>) {
    setGraphData(g => ({
      nodes: g.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ),
      links: g.links
    }));
  }

  // Remove a node
  function removeNode(nodeId: number) {
    setGraphData(g => ({
      nodes: g.nodes.filter(node => node.id !== nodeId),
      links: g.links.filter(link => {
        const sourceId = typeof link.source === 'number' ? link.source : (link.source as any).id;
        const targetId = typeof link.target === 'number' ? link.target : (link.target as any).id;
        return sourceId !== nodeId && targetId !== nodeId;
      })
    }));
  }

  // Export as JSON file
  function exportGraph() {
    const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'graph-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import from JSON file
  const importGraph = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawData = JSON.parse(event.target?.result as string);
        const processedData = processImportedGraph(rawData);
        setGraphData(processedData);
      } catch (error) {
        console.error('Error importing graph:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  // Update edge type
  function updateEdgeType(linkId: string, type: EdgeType) {
    setGraphData(g => ({
      nodes: g.nodes,
      links: g.links.map(link => 
        link.id === linkId ? { ...link, type } : link
      )
    }));
  }

  return { 
    graphData, 
    addNode, 
    addLink, 
    updateNode, 
    removeNode, 
    exportGraph, 
    importGraph, 
    updateEdgeType 
  };
}
