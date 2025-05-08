import { useState } from 'react';
import type { NodeData } from '../../types/graph';

interface SearchBarProps {
  nodes: NodeData[];
  onSelect: (nodeId: number) => void;
}

export default function SearchBar({ nodes, onSelect }: SearchBarProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const matches = nodes.filter(node => 
    node.title.toLowerCase().includes(search.toLowerCase()) ||
    node.field.toLowerCase().includes(search.toLowerCase()) ||
    Object.values(node.properties).some(value => 
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="absolute top-22 right-8 z-10">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search nodes..."
          className="px-3 py-2 rounded-lg border shadow-sm w-64"
        />
        
        {isOpen && matches.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {matches.map(node => (
              <button
                key={node.id}
                onClick={() => {
                  onSelect(node.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
              >
                {node.title} ({node.field})
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
