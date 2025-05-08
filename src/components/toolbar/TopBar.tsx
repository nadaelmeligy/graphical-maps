'use client';
import { FC } from 'react';
import type { NodeData } from '../../types/graph';
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
        fields={['field', ...new Set(nodes.flatMap(node => Object.keys(node.properties)))]}
        colorProperty={colorProperty}
        onColorPropertyChange={onColorPropertyChange}
      />
      <SearchTools nodes={nodes} onSelect={onSearchSelect} />
    </div>
  );
};

export default TopBar;