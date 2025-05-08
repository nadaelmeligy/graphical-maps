import type { NodeData } from '../types/graph';

export function getUniqueValues(nodes: NodeData[], field: string): string[] {
  return [...new Set(nodes.map(node => 
    field === 'field' ? node.field : node.properties[field]
  ))].filter(Boolean);
}

export function getUniquePropertyKeys(nodes: NodeData[]): string[] {
  const propertyKeys = new Set(nodes.flatMap(node => Object.keys(node.properties)));
  return Array.from(propertyKeys);
}
