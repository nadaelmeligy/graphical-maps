import { useState, useMemo } from 'react';
import type { NodeData } from '../types/graph';
import { getUniqueValues, getUniquePropertyKeys } from '../utils/propertyOptions';

interface NodeEditModalProps {
  node: NodeData;
  existingNodes: NodeData[];
  onClose: () => void;
  onSave: (updates: Partial<NodeData>) => void;
}

export default function NodeEditModal({ node, existingNodes, onClose, onSave }: NodeEditModalProps) {
  const [title, setTitle] = useState(node.title);
  const [field, setField] = useState(node.field);
  const [properties, setProperties] = useState(node.properties);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const uniqueFields = useMemo(() => getUniqueValues(existingNodes, 'field'), [existingNodes]);
  const existingPropertyKeys = useMemo(() => getUniquePropertyKeys(existingNodes), [existingNodes]);

  const getPropertyValues = (propertyKey: string) => 
    getUniqueValues(existingNodes, propertyKey);

  const handleAddProperty = () => {
    if (!newKey || !newValue) {
      alert('Please select a property and enter a value');
      return;
    }
    
    setProperties(prev => ({ ...prev, [newKey]: newValue }));
    setNewKey('');
    setNewValue('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Edit Node</h2>
        
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Node Title"
            className="w-full border px-2 py-1 rounded"
          />

          <input
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="Field"
            className="w-full border px-2 py-1 rounded"
            list="edit-field-options"
          />
          <datalist id="edit-field-options">
            {uniqueFields.map(f => <option key={f} value={f} />)}
          </datalist>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Properties</h3>
            {Object.entries(properties).map(([key, value]) => (
              <div key={key} className="flex gap-2 mb-2">
                <input value={key} disabled className="border px-2 py-1 rounded w-1/2" />
                <input
                  value={value}
                  onChange={(e) => setProperties(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }))}
                  className="border px-2 py-1 rounded w-1/2"
                  list={`edit-values-${key}`}
                />
                <datalist id={`edit-values-${key}`}>
                  {getPropertyValues(key).map(v => <option key={v} value={v} />)}
                </datalist>
                <button
                  onClick={() => {
                    const { [key]: _, ...rest } = properties;
                    setProperties(rest);
                  }}
                  className="text-red-500 px-2"
                >
                  ×
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <select
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="border px-2 py-1 rounded w-1/2"
              >
                <option value="">Select property</option>
                {existingPropertyKeys
                  .filter(key => !Object.keys(properties).includes(key))
                  .map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                <option value="__new__">Add new property...</option>
              </select>

              {newKey === '__new__' ? (
                <input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="New property name"
                  className="border px-2 py-1 rounded w-1/2"
                />
              ) : (
                <input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Value"
                  className="border px-2 py-1 rounded w-1/2"
                  list={newKey ? `edit-values-new-${newKey}` : undefined}
                />
              )}
            </div>
            <button
              onClick={handleAddProperty}
              disabled={!newKey || !newValue || newKey === '__new__'}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Add Property
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ title, field, properties });
              onClose();
            }}
            disabled={!title || !field}
            className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
