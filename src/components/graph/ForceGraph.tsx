import dynamic from 'next/dynamic';
import { useGraphLayout } from '../../hooks/graph/useGraphLayout';
import type { NodeData } from '../../types/graph';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

interface ForceGraphProps {
  nodes: NodeData[];
  links: any[];
  colorMapping: Map<string, string>;
  graphRef: any;
  onNodeClick: (node: NodeData, event: MouseEvent) => void;
  onNodeHover: (node: NodeData | null, event: any) => void;
  onNodeDragStart: (node: NodeData) => void;
  onNodeDrag: (node: NodeData) => void;
  onNodeDragEnd: (node: NodeData) => void;
}

export function ForceGraph({
  nodes,
  links,
  colorMapping,
  graphRef,
  ...eventHandlers
}: ForceGraphProps) {
  const { dimensions, configureD3Force } = useGraphLayout();

  return (
    <ForceGraph3D
      ref={graphRef}
      width={dimensions.width}
      height={dimensions.height}
      graphData={{ nodes, links }}
      nodeAutoColorBy={(node: any) => node.__colorKey}
      nodeColor={(node: any) => colorMapping.get(node.__colorKey)}
      nodeVal={(node: any) => (node.__edgeCount || 1) * 2}
      {...eventHandlers}
      forceEngine="d3"
      d3Force={configureD3Force}
    />
  );
}
