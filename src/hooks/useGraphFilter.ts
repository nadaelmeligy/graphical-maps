import { useMemo } from 'react';
import type { GraphData } from '../types/graph';

/**
 * Filters graph data by searchTerm and selectedFields.
 */
export function useGraphFilter(
  graphData: GraphData,
  searchTerm: string,
  selectedFields: string[]
): GraphData {
  return useMemo(() => {
    const filteredNodes = graphData.nodes.filter(n =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) && selectedFields.includes(n.field)
    );
    const ids = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = graphData.links.filter(l => ids.has(l.source as number) && ids.has(l.target as number));
    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, searchTerm, selectedFields]);
}
