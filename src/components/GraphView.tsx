'use client';
import dynamic from 'next/dynamic';
import { FC, useRef } from 'react';
import type { GraphData } from '../types/graph';

const ForceGraph3D = dynamic(
  () => import('react-force-graph-3d'),
  { ssr: false }
);

interface GraphViewProps {
  data: GraphData;
  onNodeClick: (node: any) => void;
}

const GraphView: FC<GraphViewProps> = ({ data, onNodeClick }) => {
  const fgRef = useRef<any>();
  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      nodeAutoColorBy="field"
      linkOpacity={0.6}
      nodeLabel={(n: any) => `${n.title} — ${n.field}`}
      linkDirectionalParticles={2}
      onNodeClick={node => onNodeClick(node)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}
    />
  );
};

export default GraphView;