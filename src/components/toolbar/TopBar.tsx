'use client';
import { FC } from 'react';
import type { NodeData, NodeLabelType } from '../../types/graph';
import SearchBar from './SearchBar';
import { ExportTools } from './ExportTools';
import { FilterTools } from './FilterTools';
import { ColorTools } from './ColorTools';
import { SearchTools } from './SearchTools';

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
  labelType: NodeLabelType;
  onLabelTypeChange: (type: NodeLabelType) => void;
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
  onSearchSelect,
  labelType,
  onLabelTypeChange
}) => {
  const fields = ['field', ...new Set(nodes.flatMap(node => Object.keys(node.properties)))];

  return (
    <div className={`
      flex items-center gap-4 bg-gray-700 border-b border-gray-600 text-white px-4
      transition-all duration-300 ease-in-out relative z-[9999]
      ${isVisible ? 'h-16 opacity-100 visible' : 'h-0 opacity-0 invisible'}
    `}>
      <ExportTools 
        onExportImage={onExportImage}
        onExportData={exportGraph}
        onImportData={importGraph}
      />
      <FilterTools 
        nodes={nodes}
        onFilterChange={onFilterChange}
      />
      <ColorTools 
        fields={fields}
        colorProperty={colorProperty}
        onColorPropertyChange={onColorPropertyChange}
      />
      <SearchTools nodes={nodes} onSelect={onSearchSelect} />
      <div className="flex items-center gap-2">
        <select 
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
          value={labelType}
          onChange={(e) => {
            const newType = e.target.value as NodeLabelType;
            onLabelTypeChange(newType);
            // Force immediate UI update
            e.target.blur();
          }}
        >
          <option value="none">Hide Labels</option>
          <option value="title">Node Titles</option>
          <option value="category">Categories</option>
          <option value="equation">Equations</option>
          <option value="note">Notes</option>
          <option value="url">URLs</option>
          {fields
            .filter(field => field !== 'field')
            .map(field => (
              <option key={field} value={field}>
                {field}
              </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TopBar;