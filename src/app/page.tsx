'use client';
import { useState } from 'react';
import { useGraphPersistence } from '../hooks/useGraphPersistence';
import Header from '../components/layout/Header';
import TopBar from '../components/toolbar/TopBar';
import GraphVisualization from '../components/GraphVisualization';
import ImagePreviewModal from '../components/modals/ImagePreviewModal';
import { exportGraphImage, createGraphPreview, downloadGraphImage } from '../utils/graphExport';

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
  const [graphRef, setGraphRef] = useState<{ current: any; isReady: boolean } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleExportImage = async () => {
    if (!graphRef?.current || !graphRef.isReady) {
      alert('Please wait for the graph to initialize completely.');
      return;
    }

    try {
      // Force a full render cycle
      graphRef.current.renderer().render(graphRef.current.scene(), graphRef.current.camera());
      
      // Wait for next frame to ensure render is complete
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const previewUrl = createGraphPreview(graphRef, true, processedData);
      if (!previewUrl) {
        throw new Error('Failed to generate preview URL');
      }
      
      setPreviewUrl(previewUrl);
    } catch (error) {
      console.error('Export error details:', error);
      alert(`Failed to create image preview: ${error.message}`);
    }
  };

  const handleSearchSelect = (nodeId: number) => {
    if (graphRef?.current) {
      const node = graphData.nodes.find(n => n.id === nodeId);
      if (node) {
        // Focus on the selected node with animation
        graphRef.current.cameraPosition(
          { x: node.x + 100, y: node.y + 100, z: node.z + 100 }, // new position
          { x: node.x, y: node.y, z: node.z }, // lookAt position
          2000 // transition duration in ms
        );
      }
    }
  };

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

  // Then process for coloring and sizing
  const processedData = {
    nodes: filteredNodes.map(node => {
      // Count connected edges for this node
      const edgeCount = graphData.links.filter(link => {
        const sourceId = typeof link.source === 'number' ? link.source : link.source.id;
        const targetId = typeof link.target === 'number' ? link.target : link.target.id;
        return sourceId === node.id || targetId === node.id;
      }).length;

      return {
        ...node,
        __colorKey: colorProperty === 'field' 
          ? node.field
          : node.properties[colorProperty] || 'undefined',
        __edgeCount: edgeCount,
        // Add label property that will be used in visualization
        label: node.title,
        labelColor: '#000000',
        labelProperty: { size: 12 }
      };
    }),
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
            onExportImage={handleExportImage}
            onSearchSelect={handleSearchSelect}
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
            onGraphRefUpdate={setGraphRef}
          />
        </main>
      </div>

      {previewUrl && (
        <ImagePreviewModal
          imageUrl={previewUrl}
          onClose={() => setPreviewUrl(null)}
          onConfirm={(includeLabels) => {
            const imageUrl = createGraphPreview(graphRef, includeLabels, processedData);
            downloadGraphImage(imageUrl);
            setPreviewUrl(null);
          }}
        />
      )}
    </div>
  );
}
