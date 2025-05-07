import { NodeData } from '../types/graph';

export function getUniqueValues(nodes: NodeData[], property: string): string[] {
  return [...new Set(nodes.map(node => 
    property === 'field' ? node.field : node.properties[property]
  ).filter(Boolean))];
}

export function getUniquePropertyKeys(nodes: NodeData[]): string[] {
  return [...new Set(nodes.flatMap(node => Object.keys(node.properties)))];
}
