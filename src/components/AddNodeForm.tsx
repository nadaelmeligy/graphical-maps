'use client';
import { FC, useState } from 'react';
import { NodeData } from '../types/graph';

interface AddNodeFormProps {
  onAdd: (node: NodeData) => void;
}

const AddNodeForm: FC<AddNodeFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState<string>('');
  const [field, setField] = useState<string>('');

  return (
    <div>
      <h2 className="font-semibold mb-2">Add Node</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full mb-2 p-1 border rounded"
      />
      <input
        type="text"
        placeholder="Field"
        value={field}
        onChange={e => setField(e.target.value)}
        className="w-full mb-2 p-1 border rounded"
      />
      <button
        onClick={() => {
          onAdd({ id: Date.now(), title: title || `Paper`, field: field || 'Unknown' });
          setTitle('');
          setField('');
        }}
        className="w-full mb-4 py-1 bg-blue-600 text-white rounded"
      >
        Add Node
      </button>
    </div>
  );
};

export default AddNodeForm;