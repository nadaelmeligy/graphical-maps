import type { NodeData, GraphData } from '../types/graph';

type RawGraphData = {
  nodes: any[];
  links: any[];
};

export function processImportedGraph(rawData: RawGraphData): GraphData {
  const processedNodes = rawData.nodes.map(processNode);
  const processedLinks = processLinks(rawData.links, processedNodes);

  return {
    nodes: processedNodes,
    links: processedLinks
  };
}

function processNode(rawNode: any): NodeData {
  return {
    id: Number(rawNode.id),
    title: rawNode.title || 'Untitled',
    field: rawNode.field || 'undefined',
    properties: processProperties(rawNode.properties),
    note: rawNode.note || '',
    url: rawNode.url || '',
    equation: rawNode.equation || '',  // Ensure equation is preserved
    labelConfig: rawNode.labelConfig || { type: 'title' },
    // Preserve any existing x,y,z positions if they exist
    ...(rawNode.x !== undefined ? { x: rawNode.x } : {}),
    ...(rawNode.y !== undefined ? { y: rawNode.y } : {}),
    ...(rawNode.z !== undefined ? { z: rawNode.z } : {})
  };
}

function processProperties(rawProperties: any): Record<string, string> {
  if (!rawProperties || typeof rawProperties !== 'object') {
    return {};
  }

  const processed: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawProperties)) {
    if (value !== null && value !== undefined) {
      processed[key] = String(value);
    }
  }
  return processed;
}

function processLinks(rawLinks: any[], nodes: NodeData[]): any[] {
  if (!Array.isArray(rawLinks)) return [];
  
  const nodeIds = new Set(nodes.map(n => n.id));
  const linkCounts = new Map<string, number>();
  
  return rawLinks
    .filter(link => {
      const sourceId = Number(typeof link.source === 'object' ? link.source.id : link.source);
      const targetId = Number(typeof link.target === 'object' ? link.target.id : link.target);
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    })
    .map(link => {
      const sourceId = Number(typeof link.source === 'object' ? link.source.id : link.source);
      const targetId = Number(typeof link.target === 'object' ? link.target.id : link.target);
      
      return {
        id: link.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: sourceId,
        target: targetId,
        type: link.type || 'line', // Preserve edge type or default to line
        value: link.value || 1
      };
    });
}
