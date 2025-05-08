'use client';
import { FC, useState } from 'react';

interface GraphControlsProps {
  addNode: () => void;
  exportGraph: () => void;
  importGraph: (file: File) => void;
}

const GraphControls: FC<GraphControlsProps> = ({ addNode, exportGraph, importGraph }) => {
  const handleNetworkAction = (action: string) => {
    switch (action) {
      case 'addNode':
        addNode();
        break;
      case 'addEdge':
        // Handle add edge
        break;
      case 'removeEdge':
        // Handle remove edge
        break;
      case 'export':
        exportGraph();
        break;
    }
  };

  return (
    <aside className="w-64 bg-white p-4 shadow-lg space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Network Structure</label>
        <select
          onChange={(e) => handleNetworkAction(e.target.value)}
          className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>Select action...</option>
          <optgroup label="Nodes">
            <option value="addNode">Add Node</option>
            <option value="editNode">Edit Node</option>
            <option value="removeNode">Remove Node</option>
          </optgroup>
          <optgroup label="Edges">
            <option value="addEdge">Add Edge</option>
            <option value="removeEdge">Remove Edge</option>
          </optgroup>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Import/Export</label>
        <select
          onChange={(e) => handleNetworkAction(e.target.value)}
          className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
          defaultValue=""
        >
          <option value="" disabled>Select action...</option>
          <option value="export">Export Graph</option>
          <option value="import">Import Graph</option>
        </select>
      </div>

      {/* Hidden file input for import */}
      <input
        type="file"
        accept="application/json"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) importGraph(file);
        }}
        className="hidden"
        id="fileInput"
      />
    </aside>
  );
};

export default GraphControls;
