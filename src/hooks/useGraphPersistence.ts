import { useState, useEffect } from 'react';
import type { GraphData, NodeData, LinkData } from '../types/graph';

export function useGraphPersistence() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  // Add a single node
  function addNode(title: string, field: string, properties: Record<string, string> = {}) {
    const nextId = graphData.nodes.length
      ? Math.max(...graphData.nodes.map(n => n.id)) + 1
      : 0;
    const node: NodeData = { id: nextId, title, field, properties };
    setGraphData(g => ({ nodes: [...g.nodes, node], links: g.links }));
  }

  // Add a link between nodes
  function addLink(sourceId: number, targetId: number) {
    if (sourceId === targetId) return; // Prevent self-loops
    const linkExists = graphData.links.some(
      link => link.source === sourceId && link.target === targetId
    );
    if (!linkExists) {
      setGraphData(g => ({
        nodes: g.nodes,
        links: [...g.links, { source: sourceId, target: targetId }]
      }));
    }
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
  function importGraph(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        setGraphData(json);
      } catch {
        alert('Invalid JSON');
      }
    };
    reader.readAsText(file);
  }

  return { graphData, addNode, addLink, exportGraph, importGraph };
}
