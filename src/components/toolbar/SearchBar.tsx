import { useState, useEffect, useRef } from 'react';
import type { NodeData } from '../../types/graph';

interface SearchBarProps {
  nodes: NodeData[];
  onSelect: (nodeId: number) => void;
}

export default function SearchBar({ nodes, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NodeData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search function with fuzzy matching
  const searchNodes = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchTerms = searchQuery.toLowerCase().split(' ');
    const matches = nodes.filter(node => {
      const nodeText = `${node.title} ${node.field}`.toLowerCase();
      return searchTerms.every(term => nodeText.includes(term));
    });

    setResults(matches.slice(0, 10)); // Limit to 10 results
    setSelectedIndex(0);
  };

  useEffect(() => {
    searchNodes(query);
  }, [query, nodes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelect(results[selectedIndex].id);
          setQuery('');
          setIsOpen(false);
          inputRef.current?.blur();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search nodes..."
        className="px-3 py-1 text-sm bg-gray-600 text-white rounded 
                   placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 w-48"
      />

      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 mt-1 w-64 max-h-60 overflow-auto bg-gray-700 
                     rounded shadow-lg border border-gray-600"
        >
          {results.map((node, index) => (
            <div
              key={node.id}
              className={`px-3 py-2 cursor-pointer ${
                index === selectedIndex ? 'bg-blue-500' : 'hover:bg-gray-600'
              }`}
              onClick={() => {
                onSelect(node.id);
                setQuery('');
                setIsOpen(false);
              }}
            >
              <div className="text-white font-medium">{node.title}</div>
              <div className="text-gray-400 text-sm">{node.field}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
