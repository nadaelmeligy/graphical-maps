import { useState, useMemo } from 'react';
import type { NodeData } from '../../types/graph';
import { getUniqueValues, getUniquePropertyKeys } from '../../utils/propertyOptions';

interface NodeEditModalProps {
  node: NodeData;
  existingNodes: NodeData[];
  onClose: () => void;
  onSave: (updates: Partial<NodeData>) => void;
}

export default function NodeEditModal({ node, existingNodes, onClose, onSave }: NodeEditModalProps) {
  const [formData, setFormData] = useState({
    title: node.title,
    field: node.field,
    properties: { ...node.properties },
    note: node.note || '',
    url: node.url || '' // Initialize URL from node data
  });

  const uniqueFields = useMemo(() => getUniqueValues(existingNodes, 'field'), [existingNodes]);
  const existingPropertyKeys = useMemo(() => getUniquePropertyKeys(existingNodes), [existingNodes]);

  const getPropertyValues = (propertyKey: string) => 
    getUniqueValues(existingNodes, propertyKey);

  const handleAddProperty = () => {
    if ((!formData.isNewProperty && !formData.newKey) || !formData.newValue) {
      alert('Please enter both property name and value');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      properties: { ...prev.properties, [formData.newKey]: formData.newValue },
      newKey: '',
      newValue: '',
      isNewProperty: false
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Edit Node</h2>
        
        <div className="space-y-4">
          <input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Node Title"
            className="w-full border px-2 py-1 rounded"
          />

          <input
            value={formData.field}
            onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
            placeholder="Category"
            className="w-full border px-2 py-1 rounded"
            list="edit-field-options"
          />
          <datalist id="edit-field-options">
            {uniqueFields.map(f => <option key={f} value={f} />)}
          </datalist>

          <textarea
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            placeholder="Add a note..."
            className="w-full border px-2 py-1 rounded h-24 resize-none"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Properties</h3>
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
                  list={`edit-values-${key}`}
                />
                <datalist id={`edit-values-${key}`}>
                  {getPropertyValues(key).map(v => <option key={v} value={v} />)}
                </datalist>
                <button
                  onClick={() => {
                    const { [key]: _, ...rest } = formData.properties;
                    setFormData(prev => ({ ...prev, properties: rest }));
                  }}
                  className="text-red-500 px-2"
                >
                  ×
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              {formData.isNewProperty ? (
                <input
                  value={formData.newKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, newKey: e.target.value }))}
                  placeholder="New property name"
                  className="border px-2 py-1 rounded w-1/2"
                />
              ) : (
                <select
                  value={formData.newKey}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setFormData(prev => ({ ...prev, isNewProperty: true, newKey: '' }));
                    } else {
                      setFormData(prev => ({ ...prev, newKey: e.target.value }));
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
                value={formData.newValue}
                onChange={(e) => setFormData(prev => ({ ...prev, newValue: e.target.value }))}
                placeholder="Value"
                className="border px-2 py-1 rounded w-1/2"
                list={!formData.isNewProperty && formData.newKey ? `edit-values-new-${formData.newKey}` : undefined}
              />
              {!formData.isNewProperty && formData.newKey && (
                <datalist id={`edit-values-new-${formData.newKey}`}>
                  {getPropertyValues(formData.newKey).map(v => <option key={v} value={v} />)}
                </datalist>
              )}
            </div>
            <button
              onClick={handleAddProperty}
              disabled={(!formData.isNewProperty && !formData.newKey) || !formData.newValue}
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
              onSave({
                title: formData.title,
                field: formData.field,
                properties: formData.properties,
                note: formData.note,
                url: formData.url
              });
              onClose();
            }}
            disabled={!formData.title || !formData.field}
            className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
