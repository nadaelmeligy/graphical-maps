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
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [colorProperty, setColorProperty] = useState('field');

  // First apply filters
  const filteredNodes = filter 
    ? graphData.nodes.filter(node => {
        if (filter.field === 'field') {
          return node.field === filter.value;
        }
        // Check if the property exists and matches the filter value
        return node.properties[filter.field] === filter.value;
      })
    : graphData.nodes;

  // Then process for coloring
  const processedData = {
    nodes: filteredNodes.map(node => ({
      ...node,
      __colorKey: colorProperty === 'field' 
        ? node.field  // Use field value directly for category coloring
        : node.properties[colorProperty] || 'undefined'  // Use property value directly
    })),
    links: graphData.links.filter(link => 
      filteredNodes.some(n => n.id === link.source) && 
      filteredNodes.some(n => n.id === link.target)
    )
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      {/* Application header with title and main navigation */}
      <Header 
        onToggleTopBar={() => setIsTopBarVisible(!isTopBarVisible)} 
        isTopBarVisible={isTopBarVisible}
      />

      <div className="flex-1 flex flex-col bg-white">
        <div className="w-full overflow-hidden">
          {/* Controls for graph import/export operations */}
          <TopBar 
            exportGraph={exportGraph} 
            importGraph={importGraph}
            nodes={graphData.nodes}
            onFilterChange={(field, value) => setFilter(value ? { field, value } : null)}
            isVisible={isTopBarVisible}
            colorProperty={colorProperty}
            onColorPropertyChange={setColorProperty}
          />
        </div>

        {/* Main content area with graph visualization */}
        <main className="flex-1 relative overflow-hidden">
          <GraphVisualization
            graphData={processedData}
            addNode={(title, field, properties, note) => addNode(title, field, properties, note)}
            addLink={addLink}
            updateNode={updateNode}
            removeNode={removeNode}
            colorProperty={colorProperty}
          />
        </main>
      </div>
    </div>
  );
}
