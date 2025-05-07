'use client';
import { useState, useMemo } from 'react';
import type { NodeData } from '../types/graph';
import { getUniqueValues, getUniquePropertyKeys } from '../utils/propertyOptions';

interface NodePropertiesModalProps {
  existingNodes: NodeData[];
  onClose: () => void;
  onSave: (data: { title: string; field: string; properties: Record<string, string> }) => void;
}

export default function NodePropertiesModal({ existingNodes, onClose, onSave }: NodePropertiesModalProps) {
  const [title, setTitle] = useState('');
  const [field, setField] = useState('');
  const [properties, setProperties] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // Get unique values for fields and properties
  const uniqueFields = useMemo(() => getUniqueValues(existingNodes, 'field'), [existingNodes]);
  const existingPropertyKeys = useMemo(() => getUniquePropertyKeys(existingNodes), [existingNodes]);

  const getPropertyValues = (propertyKey: string) => 
    getUniqueValues(existingNodes, propertyKey);

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
        <h2 className="text-xl mb-4">Add New Node</h2>
        
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Node Title"
            className="w-full border px-2 py-1 rounded"
          />

          <div className="flex gap-2">
            <input
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="Field"
              className="w-1/2 border px-2 py-1 rounded"
              list="field-options"
            />
            <datalist id="field-options">
              {uniqueFields.map(f => <option key={f} value={f} />)}
            </datalist>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Custom Properties</h3>
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
                  list={`values-${key}`}
                />
                <datalist id={`values-${key}`}>
                  {getPropertyValues(key).map(v => <option key={v} value={v} />)}
                </datalist>
              </div>
            ))}

            <div className="flex gap-2">
              <input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Property name"
                className="border px-2 py-1 rounded w-1/2"
                list="property-keys"
              />
              <datalist id="property-keys">
                {existingPropertyKeys.map(key => <option key={key} value={key} />)}
              </datalist>

              <input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value"
                className="border px-2 py-1 rounded w-1/2"
                list={newKey ? `values-new-${newKey}` : undefined}
              />
              {newKey && (
                <datalist id={`values-new-${newKey}`}>
                  {getPropertyValues(newKey).map(v => <option key={v} value={v} />)}
                </datalist>
              )}
            </div>
            <button
              onClick={handleAddProperty}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Add Property
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (title && field) {
                onSave({ title, field, properties });
              }
            }}
            disabled={!title || !field}
            className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            Create Node
          </button>
        </div>
      </div>
    </div>
  );
}
