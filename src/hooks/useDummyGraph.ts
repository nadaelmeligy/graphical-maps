import { useEffect, useState } from 'react';
import type { GraphData, NodeData, LinkData } from '../types/graph';

/**
 * Generates dummy graph data once and exposes state.
 */
export function useDummyGraph(N: number = 50, linkProb: number = 0.05) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [fields, setFields] = useState<string[]>([]);

  useEffect(() => {
    const nodes: NodeData[] = Array.from({ length: N }, (_, i) => ({ id: i, title: `Paper ${i}`, field: `Field ${i % 5}` }));
    const links: LinkData[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (Math.random() < linkProb) links.push({ source: i, target: j });
      }
    }
    setGraphData({ nodes, links });
    const uniq = Array.from(new Set(nodes.map(n => n.field)));
    setFields(uniq);
  }, [N, linkProb]);

  return { graphData, fields };
}
