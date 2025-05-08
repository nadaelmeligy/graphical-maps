interface AboutModalProps {
  onClose: () => void;
}

export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">About Graphical Maps</h2>
        
        <div className="space-y-4 text-gray-600">
          <p>
            Graphical Maps is a powerful visualization tool designed to help users create, 
            explore, and analyze complex relationships through interactive 3D graph networks.
          </p>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interactive 3D graph visualization</li>
              <li>Custom node properties and categories</li>
              <li>Dynamic node filtering and coloring</li>
              <li>Drag-and-drop node positioning</li>
              <li>Edge creation between nodes</li>
              <li>Import/Export functionality</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Click on empty space to create a new node</li>
              <li>Drag nodes to reposition them</li>
              <li>Right-click on nodes for more options</li>
              <li>Use the top bar to filter and color nodes</li>
              <li>Export your work to save progress</li>
            </ul>
          </section>

          <p className="text-sm text-gray-500 mt-6">
            Version 1.0.0 • Created by [Nada Elmeligy/M. Schwarz Theory Group]
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
