'use client';

import dynamic from 'next/dynamic';
import Header from '../components/Header';
import GraphControls from '../components/GraphControls';
import { useGraphPersistence } from '../hooks/useGraphPersistence';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function Page() {
  // Pull in graph state + handlers
  const { graphData, addNode, exportGraph, importGraph } = useGraphPersistence();

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1">
        {/* Controls panel */}
        <GraphControls
          addNode={() => {
            const title = prompt('Node title:') ?? '';
            if (!title) return;
            const field = prompt('Field/category:') ?? '';
            addNode(title, field);
          }}
          exportGraph={exportGraph}
          importGraph={importGraph}
        />

        {/* Graph canvas */}
        <main className="flex-1 relative">
          <ForceGraph3D
            graphData={graphData}
            nodeAutoColorBy="field"
            linkOpacity={0.6}
            nodeLabel={(n: any) => `${n.title} — ${n.field}`}
            linkDirectionalParticles={2}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              zIndex: 0
            }}
          />
        </main>
      </div>
    </div>
  );
}
