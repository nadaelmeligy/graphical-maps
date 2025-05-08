import { useState, useMemo } from 'react';
import type { NodeData } from '../../types/graph';

interface FilterToolsProps {
  nodes: NodeData[];
  onFilterChange: (field: string, value: string) => void;
}

export function FilterTools({ nodes, onFilterChange }: FilterToolsProps) {
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');

  const fields = useMemo(() => {
    const propertyKeys = new Set(nodes.flatMap(node => Object.keys(node.properties)));
    return ['field', ...Array.from(propertyKeys)];
  }, [nodes]);
  
  const uniqueValues = useMemo(() => {
    if (!selectedField) return [];
    return [...new Set(nodes.map(node => 
      selectedField === 'field' ? node.field : node.properties[selectedField]
    ))].filter(Boolean);
  }, [nodes, selectedField]);

  return (
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
            <option key={field} value={field}>Filter by {field}</option>
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
  );
}
