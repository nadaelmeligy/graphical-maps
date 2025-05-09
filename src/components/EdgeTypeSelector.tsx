import { EdgeType } from '../types/graph';

interface EdgeTypeSelectorProps {
  currentType: EdgeType;
  onChange: (type: EdgeType) => void;
}

export default function EdgeTypeSelector({ currentType, onChange }: EdgeTypeSelectorProps) {
  return (
    <select
      value={currentType}
      onChange={(e) => onChange(e.target.value as EdgeType)}
      className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition"
    >
      <option value="line">Simple Line</option>
      <option value="arrow">Single Arrow</option>
      <option value="bidirectional">Double Arrow</option>
      <option value="dashed">Dashed Line</option>
      <option value="dotted">Dotted Line</option>
    </select>
  );
}
