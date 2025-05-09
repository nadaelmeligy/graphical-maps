import { useState } from 'react';

interface Section {
  title: string;
  content: React.ReactNode;
}

export default function DocumentationModal({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState('basics');

  const sections: Record<string, Section> = {
    basics: {
      title: "Basic Usage",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold">Creating Nodes</h3>
          <ul className="list-disc pl-5">
            <li>Click anywhere on the canvas to create a new node</li>
            <li>Fill in the node's title, category, and optional properties</li>
            <li>Add URLs to make nodes clickable</li>
          </ul>

          <h3 className="font-bold">Creating Connections</h3>
          <ul className="list-disc pl-5">
            <li>Right-click a node and select "Create Edge from Here"</li>
            <li>Click another node to complete the connection</li>
          </ul>
        </div>
      )
    },
    navigation: {
      title: "Navigation & Camera",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold">Camera Controls</h3>
          <ul className="list-disc pl-5">
            <li>Arrow keys: Move camera position</li>
            <li>Space + Arrow keys: Rotate camera</li>
            <li>Or use the on-screen arrow controls</li>
          </ul>

          <h3 className="font-bold">View Options</h3>
          <ul className="list-disc pl-5">
            <li>Reset View button returns to default position</li>
            <li>Drag to rotate the view</li>
            <li>Scroll to zoom in/out</li>
          </ul>
        </div>
      )
    },
    layouts: {
      title: "Layouts & Organization",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold">Layout Options</h3>
          <ul className="list-disc pl-5">
            <li>Force-Directed: Natural, physics-based layout</li>
            <li>Radial: Nodes arranged in circles</li>
            <li>Grid: Organized grid pattern</li>
            <li>More layouts available in settings</li>
          </ul>

          <h3 className="font-bold">Node Organization</h3>
          <ul className="list-disc pl-5">
            <li>Color coding by category or properties</li>
            <li>Size indicates connection count</li>
            <li>Drag nodes to manually position</li>
          </ul>
        </div>
      )
    },
    keyboard: {
      title: "Keyboard Shortcuts",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-mono bg-gray-100 p-2 rounded">ESC</div>
            <div>Cancel current action</div>
            
            <div className="font-mono bg-gray-100 p-2 rounded">←↑↓→</div>
            <div>Move camera</div>
            
            <div className="font-mono bg-gray-100 p-2 rounded">Space + Arrows</div>
            <div>Rotate camera</div>
          </div>
        </div>
      )
    },
    export: {
      title: "Import/Export",
      content: (
        <div className="space-y-4">
          <h3 className="font-bold">Export Options</h3>
          <ul className="list-disc pl-5">
            <li>Export as JSON to save your work</li>
            <li>Export as image (with or without labels)</li>
            <li>Import previously saved graphs</li>
          </ul>

          <h3 className="font-bold">Data Format</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify({
              nodes: [{ id: 1, title: "Example", field: "Category" }],
              links: [{ source: 1, target: 2 }]
            }, null, 2)}
          </pre>
        </div>
      )
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto py-8">
      <div className="bg-white rounded-lg w-[900px] max-h-[80vh] flex">
        {/* Sidebar */}
        <div className="w-64 border-r p-4 space-y-2 bg-gray-50">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full text-left px-4 py-2 rounded ${
                activeSection === key 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">
              {sections[activeSection].title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
}
