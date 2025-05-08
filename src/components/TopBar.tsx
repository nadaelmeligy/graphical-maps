'use client';
import { FC, useState, useMemo } from 'react';
import type { NodeData } from '../types/graph';
import SearchBar from './toolbar/SearchBar';

interface TopBarProps {
  exportGraph: () => void;
  importGraph: (file: File) => void;
  nodes: NodeData[];
  onFilterChange: (field: string, value: string) => void;
  onColorPropertyChange: (property: string) => void;
  colorProperty: string;
  isVisible: boolean;
  onExportImage: () => void;
  onSearchSelect: (nodeId: number) => void;
}

const TopBar: FC<TopBarProps> = ({ 
  exportGraph, 
  importGraph, 
  nodes, 
  onFilterChange, 
  onColorPropertyChange,
  colorProperty,
  isVisible,
  onExportImage,
  onSearchSelect
}) => {
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');

  // Get all available fields including custom properties
  const fields = useMemo(() => {
    const propertyKeys = new Set(nodes.flatMap(node => Object.keys(node.properties)));
    return ['field', ...Array.from(propertyKeys)];
  }, [nodes]);
  
  // Get unique values for the selected field
  const uniqueValues = useMemo(() => {
    if (!selectedField) return [];
    return [...new Set(nodes.map(node => 
      selectedField === 'field' ? node.field : node.properties[selectedField]
    ))].filter(Boolean);
  }, [nodes, selectedField]);

  return (
    <div className={`
      flex items-center gap-4 bg-gray-700 border-b border-gray-600 text-white px-4
      transition-all duration-300 ease-in-out
      ${isVisible ? 'h-16 opacity-100 visible' : 'h-0 opacity-0 invisible'}
    `}>
      <div className="flex items-center gap-2">
        <button
          onClick={onExportImage}
          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Export Image
        </button>
        <button
          onClick={exportGraph}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Export Data
        </button>
        <label className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer">
          Import Data
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
      </div>

      <div className="flex items-center gap-2">
        <select 
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
          value={selectedField}
          onChange={(e) => {
            setSelectedField(e.target.value);
            setSelectedValue('');
            onFilterChange(e.target.value, '');
          }}
        >
          <option value="">Select filter</option>
          <option value="field">Filter by Category</option>
          {fields
            .filter(field => field !== 'field')
            .map(field => (
              <option key={field} value={field}>
                Filter by {field}
              </option>
          ))}
        </select>

        <select
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          value={selectedValue}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedValue(value);
            onFilterChange(selectedField, value);
          }}
          disabled={!selectedField}
        >
          <option value="">Show all</option>
          {uniqueValues.map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <select 
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
          value={colorProperty}
          onChange={(e) => onColorPropertyChange(e.target.value)}
        >
          <option value="field">Color by Category</option>
          {fields
            .filter(field => field !== 'field')
            .map(field => (
              <option key={field} value={field}>
                Color by {field}
              </option>
          ))}
        </select>
        <SearchBar nodes={nodes} onSelect={onSearchSelect} />
      </div>
    </div>
  );
};

export default TopBar;
