interface ColorToolsProps {
  fields: string[];
  colorProperty: string;
  onColorPropertyChange: (property: string) => void;
}

export function ColorTools({ fields, colorProperty, onColorPropertyChange }: ColorToolsProps) {
  return (
    <div className="flex items-center gap-2">
      <select 
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
        value={colorProperty}
        onChange={(e) => onColorPropertyChange(e.target.value)}
      >
        {fields.map(field => (
          <option key={`color-${field}`} value={field}>
            Color by {field === 'field' ? 'Category' : field}
          </option>
        ))}
      </select>
    </div>
  );
}
