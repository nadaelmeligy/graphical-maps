'use client';
import { FC } from 'react';

interface GraphControlsProps {
  addNode: () => void;
  exportGraph: () => void;
  importGraph: (file: File) => void;
}

const GraphControls: FC<GraphControlsProps> = ({ addNode, exportGraph, importGraph }) => (
  <aside className="w-64 bg-white p-4 shadow-lg space-y-4">
    <button
      onClick={addNode}
      className="w-full py-2 bg-blue-600 text-white rounded"
    >
      Add Node
    </button>

    <button
      onClick={exportGraph}
      className="w-full py-2 bg-green-600 text-white rounded"
    >
      Export Graph
    </button>

    <label className="block">
      <span className="text-sm">Import Graph</span>
      <input
        type="file"
        accept="application/json"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) importGraph(file);
        }}
        className="mt-1"
      />
    </label>
  </aside>
);

export default GraphControls;
