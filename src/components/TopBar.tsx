'use client';
import { FC, useState } from 'react';
import type { NodeData } from '../types/graph';

interface TopBarProps {
  exportGraph: () => void;
  importGraph: (file: File) => void;
  nodes: NodeData[];
  onFilterChange: (field: string, value: string) => void;
}

const TopBar: FC<TopBarProps> = ({ exportGraph, importGraph, nodes, onFilterChange }) => {
  const [selectedField, setSelectedField] = useState<string>('field');
  
  // Get all available fields including custom properties
  const fields = ['field', ...new Set(nodes.flatMap(node => Object.keys(node.properties)))];
  
  // Get unique values for the selected field
  const uniqueValues = [...new Set(nodes.map(node => 
    selectedField === 'field' ? node.field : node.properties[selectedField] || ''
  ))].filter(Boolean);

  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b">
      <button
        onClick={exportGraph}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Export Graph
      </button>
      <label className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer">
        Import Graph
        <input
          type="file"
          accept="application/json"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) importGraph(file);
          }}
          className="hidden"
        />
      </label>
      
      <div className="flex items-center gap-2">
        <select 
          className="border rounded px-2 py-1"
          value={selectedField}
          onChange={(e) => {
            setSelectedField(e.target.value);
            onFilterChange(e.target.value, '');
          }}
        >
          <option value="">Select property</option>
          {fields.map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-1"
          onChange={(e) => onFilterChange(selectedField, e.target.value)}
          disabled={!selectedField}
        >
          <option value="">All</option>
          {uniqueValues.map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TopBar;
