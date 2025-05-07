'use client';
import { FC, useState } from 'react';
import { LinkData } from '../types/graph';

interface AddEdgeFormProps {
  onAdd: (edge: LinkData) => void;
}

const AddEdgeForm: FC<AddEdgeFormProps> = ({ onAdd }) => {
  const [src, setSrc] = useState<number | ''>('');
  const [tgt, setTgt] = useState<number | ''>('');

  return (
    <div>
      <h2 className="font-semibold mb-2">Add Edge</h2>
      <input
        type="number"
        placeholder="Source ID"
        value={src}
        onChange={e => setSrc(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full mb-2 p-1 border rounded"
      />
      <input
        type="number"
        placeholder="Target ID"
        value={tgt}
        onChange={e => setTgt(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full mb-2 p-1 border rounded"
      />
      <button
        onClick={() => {
          if (src !== '' && tgt !== '') {
            onAdd({ source: Number(src), target: Number(tgt) });
          }
          setSrc('');
          setTgt('');
        }}
        className="w-full py-1 bg-green-600 text-white rounded"
      >
        Add Edge
      </button>
    </div>
  );
};

export default AddEdgeForm;
