import { useState } from 'react';
import type { NodeData } from '../types/graph';

interface NodeEditModalProps {
  node: NodeData;
  onClose: () => void;
  onSave: (updates: Partial<NodeData>) => void;
}

export default function NodeEditModal({ node, onClose, onSave }: NodeEditModalProps) {
  const [properties, setProperties] = useState(node.properties);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddProperty = () => {
    if (newKey && newValue) {
      setProperties(prev => ({ ...prev, [newKey]: newValue }));
      setNewKey('');
      setNewValue('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Edit Node: {node.title}</h2>
        
        <div className="space-y-4">
          {Object.entries(properties).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <input
                value={key}
                disabled
                className="border px-2 py-1 rounded w-1/2"
              />
              <input
                value={value}
                onChange={(e) => setProperties(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
                className="border px-2 py-1 rounded w-1/2"
              />
            </div>
          ))}

          <div className="flex gap-2">
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="New property name"
              className="border px-2 py-1 rounded w-1/2"
            />
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value"
              className="border px-2 py-1 rounded w-1/2"
            />
          </div>
          <button
            onClick={handleAddProperty}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Add Property
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ properties });
              onClose();
            }}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
