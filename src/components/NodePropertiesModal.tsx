'use client';
import { FC, useState } from 'react';

interface NodePropertiesModalProps {
  onSave: (data: { title: string; field: string; properties: Record<string, string> }) => void;
  onClose: () => void;
}

const NodePropertiesModal: FC<NodePropertiesModalProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [field, setField] = useState('');
  const [properties, setProperties] = useState<Record<string, string>>({});
  const [newPropKey, setNewPropKey] = useState('');

  const handleAddProperty = () => {
    if (newPropKey && !properties[newPropKey]) {
      setProperties({ ...properties, [newPropKey]: '' });
      setNewPropKey('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, field, properties });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-80 backdrop-blur-lg bg-transparent border border-white/10 rounded-lg p-4 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-1.5 bg-white/10 border-0 rounded-md 
                       backdrop-blur-sm text-white placeholder-white/70
                       focus:ring-1 focus:ring-white/30 focus:outline-none"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="Field"
              className="w-full p-1.5 bg-white/10 border-0 rounded-md 
                       backdrop-blur-sm text-white placeholder-white/70
                       focus:ring-1 focus:ring-white/30 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            {Object.entries(properties).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <input
                  type="text"
                  value={key}
                  disabled
                  className="w-1/3 p-1.5 bg-white/5 border-0 rounded-md text-white/70"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setProperties({ ...properties, [key]: e.target.value })}
                  className="flex-1 p-1.5 bg-white/10 border-0 rounded-md 
                           backdrop-blur-sm text-white placeholder-white/70
                           focus:ring-1 focus:ring-white/30 focus:outline-none"
                />
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newPropKey}
                onChange={(e) => setNewPropKey(e.target.value)}
                placeholder="New property"
                className="flex-1 p-1.5 bg-white/10 border-0 rounded-md 
                         backdrop-blur-sm text-white placeholder-white/70
                         focus:ring-1 focus:ring-white/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddProperty}
                className="px-2 py-1.5 bg-white/10 text-white rounded-md 
                         hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-white/10 text-white rounded-md 
                       hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodePropertiesModal;
