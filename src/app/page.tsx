'use client';
import { useState } from 'react';
import { useGraphPersistence } from '../hooks/useGraphPersistence';
import Header from '../components/Header';
import TopBar from '../components/TopBar';
import GraphVisualization from '../components/GraphVisualization';

/**
 * Main page component that orchestrates the graph visualization application
 * Handles the overall layout and data management while delegating specific
 * functionality to specialized components
 */
export default function Page() {
  // Hook for managing graph data persistence and operations
  const { graphData, addNode, addLink, updateNode, removeNode, exportGraph, importGraph } = useGraphPersistence();
  const [filter, setFilter] = useState<{ field: string; value: string } | null>(null);

  const filteredData = {
    ...graphData,
    nodes: filter 
      ? graphData.nodes.filter(node => 
          filter.field === 'field' 
            ? node.field === filter.value
            : node.properties[filter.field] === filter.value
        )
      : graphData.nodes
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Application header with title and main navigation */}
      <Header />

      {/* Controls for graph import/export operations */}
      <TopBar 
        exportGraph={exportGraph} 
        importGraph={importGraph}
        nodes={graphData.nodes}
        onFilterChange={(field, value) => setFilter(value ? { field, value } : null)}
      />

      {/* Main content area with graph visualization */}
      <main className="flex-1 relative">
        <GraphVisualization
          graphData={filteredData}
          addNode={addNode}
          addLink={addLink}
          updateNode={updateNode}
          removeNode={removeNode}
        />
      </main>
    </div>
  );
}
