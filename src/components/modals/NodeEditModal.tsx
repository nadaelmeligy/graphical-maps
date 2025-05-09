import { useState } from 'react';
import type { NodeData } from '../../types/graph';

interface NodeEditModalProps {
  node: NodeData;
  existingNodes: NodeData[];
  onClose: () => void;
  onSave: (updates: Partial<NodeData>) => void;
}

export default function NodeEditModal({ node, existingNodes, onClose, onSave }: NodeEditModalProps) {
  const [title, setTitle] = useState(node.title);
  const [field, setField] = useState(node.field);
  const [note, setNote] = useState(node.note || '');
  const [url, setUrl] = useState(node.url || '');
  const [equation, setEquation] = useState(node.equation || '');
  const [properties, setProperties] = useState<Record<string, string>>(node.properties || {});

  const handleSave = () => {
    onSave({
      title,
      field,
      note,
      url,
      equation,
      properties
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Edit Node</h2>
        
        <div className="space-y-4">
          {/* Title field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Field/Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Equation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Equation (LaTeX)</label>
            <textarea
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
            />
          </div>

          {/* Properties */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Properties</label>
            {Object.entries(properties).map(([key, value]) => (
              <div key={key} className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    const newProps = { ...properties };
                    delete newProps[key];
                    newProps[e.target.value] = value;
                    setProperties(newProps);
                  }}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Property name"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setProperties({ ...properties, [key]: e.target.value })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Value"
                />
                <button
                  onClick={() => {
                    const newProps = { ...properties };
                    delete newProps[key];
                    setProperties(newProps);
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => setProperties({ ...properties, '': '' })}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Property
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
