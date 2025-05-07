'use client';
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
  const { graphData, addNode, addLink, exportGraph, importGraph } = useGraphPersistence();

  return (
    <div className="flex flex-col h-screen">
      {/* Application header with title and main navigation */}
      <Header />

      {/* Controls for graph import/export operations */}
      <TopBar exportGraph={exportGraph} importGraph={importGraph} />

      {/* Main content area with graph visualization */}
      <main className="flex-1 relative">
        <GraphVisualization
          graphData={graphData}
          addNode={addNode}
          addLink={addLink}
        />
      </main>
    </div>
  );
}
