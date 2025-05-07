'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ResizeHandle from '../components/ResizeHandle';
import GraphView from '../components/GraphView';
import { useDummyGraph } from '../hooks/useDummyGraph';
import { useResize } from '../hooks/useResize';
import { useGraphFilter } from '../hooks/useGraphFilter';
import type { NodeData, LinkData } from '../types/graph';

export default function Page() {
  // Sidebar resizing
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing]   = useState(false);
  useResize(isResizing, setSidebarWidth);

  // Dummy graph data
  const { graphData, fields } = useDummyGraph();

  // Initialize toggles when fields load
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  useEffect(() => {
    setSelectedFields(fields);
  }, [fields]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filtered graph
  const filteredData = useGraphFilter(
    graphData,
    searchTerm,
    selectedFields
  );

  // Handlers
  const handleAddNode = (node: NodeData) => {
    // Add node
    setGraphData(g => ({ nodes: [...g.nodes, node], links: g.links }));
    // Ensure its field is toggled on
    if (!selectedFields.includes(node.field)) {
      setSelectedFields(s => [...s, node.field]);
    }
  };
  const handleAddEdge = (edge: LinkData) => {
    setGraphData(g => ({ nodes: g.nodes, links: [...g.links, edge] }));
  };
  const toggleField = (f: string) => {
    setSelectedFields(s =>
      s.includes(f) ? s.filter(x => x !== f) : [...s, f]
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          width={sidebarWidth}
          fields={fields}
          selectedFields={selectedFields}
          onToggleField={toggleField}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onAddNode={handleAddNode}
          onAddEdge={handleAddEdge}
        />
        <ResizeHandle onMouseDown={() => setIsResizing(true)} />
        <main className="flex-1 relative">
          <GraphView
            data={filteredData}
            onNodeClick={() => {/* no-op for now */}}
          />
        </main>
      </div>
    </div>
  );
}
