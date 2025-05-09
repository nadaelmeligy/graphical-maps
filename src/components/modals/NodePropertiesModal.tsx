'use client';
import { useState, useMemo } from 'react';
import type { NodeData } from '../../types/graph';
import { getUniqueValues, getUniquePropertyKeys } from '../../utils/propertyOptions';

interface NodeFormData {
  title: string;
  field: string;
  properties: Record<string, string>;
  note: string;
  url: string;
}

interface NodePropertiesModalProps {
  existingNodes: NodeData[];
  onClose: () => void;
  onSave: (data: NodeFormData) => void;
}

export default function NodePropertiesModal({ existingNodes, onClose, onSave }: NodePropertiesModalProps) {
  const [formData, setFormData] = useState<NodeFormData>({
    title: '',
    field: '',
    properties: {},
    note: '',
    url: ''
  });
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
    
    setFormData(prev => ({
      ...prev,
      properties: { ...prev.properties, [newKey]: newValue }
    }));
    setNewKey('');
    setNewValue('');
    setIsNewProperty(false);
  };

  const removeProperty = (key: string) => {
    const { [key]: _, ...rest } = formData.properties;
    setFormData(prev => ({
      ...prev,
      properties: rest
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Add New Node</h2>
        
        <div className="space-y-4">
          <input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Node Title"
            className="w-full border px-2 py-1 rounded"
          />

          <div className="flex gap-2 mb-4">
            <input
              value={formData.field}
              onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
              placeholder="Category"
              className="w-full border px-2 py-1 rounded"
              list="field-options"
            />
            <datalist id="field-options">
              {uniqueFields.map(f => <option key={f} value={f} />)}
            </datalist>
          </div>

          <textarea
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            placeholder="Add a note..."
            className="w-full border px-2 py-1 rounded h-24 resize-none"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">URL (Optional)</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Custom Properties</h3>
            {Object.entries(formData.properties).map(([key, value]) => (
              <div key={key} className="flex gap-2 mb-2">
                <input value={key} disabled className="border px-2 py-1 rounded w-1/2" />
                <input
                  value={value}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    properties: {
                      ...prev.properties,
                      [key]: e.target.value
                    }
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
                    .filter(key => !Object.keys(formData.properties).includes(key))
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
              if (formData.title && formData.field) {
                onSave(formData);
              }
            }}
            disabled={!formData.title || !formData.field}
            className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            Create Node
          </button>
        </div>
      </div>
    </div>
  );
}
