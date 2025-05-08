'use client';
import { useState, useMemo } from 'react';
import type { NodeData } from '../../types/graph';
import { getUniqueValues, getUniquePropertyKeys } from '../../utils/propertyOptions';

interface NodePropertiesModalProps {
  existingNodes: NodeData[];
  onClose: () => void;
  onSave: (data: { title: string; field: string; properties: Record<string, string>; note: string; }) => void;
}

export default function NodePropertiesModal({ existingNodes, onClose, onSave }: NodePropertiesModalProps) {
  const [title, setTitle] = useState('');
  const [field, setField] = useState('');
  const [note, setNote] = useState('');
  const [properties, setProperties] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isNewProperty, setIsNewProperty] = useState(false);

  // Get unique values for fields and properties
  const uniqueFields = useMemo(() => getUniqueValues(existingNodes, 'field'), [existingNodes]);
  const existingPropertyKeys = useMemo(() => getUniquePropertyKeys(existingNodes), [existingNodes]);

  const getPropertyValues = (propertyKey: string) => 
    getUniqueValues(existingNodes, propertyKey);

  const handleAddProperty = () => {
    if ((!isNewProperty && !newKey) || !newValue) {
      alert('Please enter both property name and value');
      return;
    }
    
    setProperties(prev => ({ ...prev, [newKey]: newValue }));
    setNewKey('');
    setNewValue('');
    setIsNewProperty(false);
  };

  const removeProperty = (key: string) => {
    const { [key]: _, ...rest } = properties;
    setProperties(rest);
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

          <div className="flex gap-2 mb-4">
            <input
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="Category"
              className="w-full border px-2 py-1 rounded"
              list="field-options"
            />
            <datalist id="field-options">
              {uniqueFields.map(f => <option key={f} value={f} />)}
            </datalist>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full border px-2 py-1 rounded h-24 resize-none"
          />

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
                <button
                  onClick={() => removeProperty(key)}
                  className="text-red-500 px-2"
                >
                  ×
                </button>
                <datalist id={`values-${key}`}>
                  {getPropertyValues(key).map(v => <option key={v} value={v} />)}
                </datalist>
              </div>
            ))}

            <div className="flex gap-2">
              {isNewProperty ? (
                <input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="New property name"
                  className="border px-2 py-1 rounded w-1/2"
                />
              ) : (
                <select
                  value={newKey}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setIsNewProperty(true);
                      setNewKey('');
                    } else {
                      setNewKey(e.target.value);
                    }
                  }}
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
              )}

              <input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value"
                className="border px-2 py-1 rounded w-1/2"
                list={!isNewProperty && newKey ? `values-new-${newKey}` : undefined}
              />
              {!isNewProperty && newKey && (
                <datalist id={`values-new-${newKey}`}>
                  {getPropertyValues(newKey).map(v => <option key={v} value={v} />)}
                </datalist>
              )}
            </div>
            <button
              onClick={handleAddProperty}
              disabled={(!isNewProperty && !newKey) || !newValue}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
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
                onSave({ title, field, properties, note });
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
