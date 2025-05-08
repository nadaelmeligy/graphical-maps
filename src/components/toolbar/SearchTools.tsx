import { useState } from 'react';
import type { NodeData } from '../../types/graph';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchToolsProps {
  nodes: NodeData[];
  onSelect: (nodeId: number) => void;
}

export function SearchTools({ nodes, onSelect }: SearchToolsProps) {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredNodes = search
    ? nodes.filter(node => 
        node.title.toLowerCase().includes(search.toLowerCase()) ||
        Object.values(node.properties).some(value => 
          value?.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
    : [];

  return (
    <div className="relative z-[10000]">
      <div className="flex items-center bg-gray-600 rounded px-3 py-1">
        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          placeholder="Search nodes..."
          className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none ml-2 w-48"
          onFocus={() => setShowResults(true)}
        />
      </div>

      {showResults && filteredNodes.length > 0 && (
        <div className="fixed mt-1 w-64 max-h-60 overflow-y-auto bg-white rounded-md shadow-lg border border-gray-200 z-[10001]">
          {filteredNodes.map(node => (
            <button
              key={node.id}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900"
              onClick={() => {
                onSelect(node.id);
                setSearch('');
                setShowResults(false);
              }}
            >
              <div className="font-medium text-gray-900">{node.title}</div>
              <div className="text-xs text-gray-500">{node.field}</div>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close results when clicking outside */}
      {showResults && (
        <div 
          className="fixed inset-0 z-[10000]"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
