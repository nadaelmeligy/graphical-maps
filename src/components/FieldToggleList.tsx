'use client';
import { FC } from 'react';

interface FieldToggleListProps {
  fields: string[];
  selected: string[];
  onToggle: (field: string) => void;
}

const FieldToggleList: FC<FieldToggleListProps> = ({ fields, selected, onToggle }) => (
  <div>
    <h2 className="font-semibold mb-2">Fields</h2>
    {fields.map(f => (
      <label key={f} className="block mb-1">
        <input
          type="checkbox"
          checked={selected.includes(f)}
          onChange={() => onToggle(f)}
          className="mr-2"
        />
        {f}
      </label>
    ))}
  </div>
);

export default FieldToggleList;
