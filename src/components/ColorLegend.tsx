import React from 'react';

interface ColorLegendProps {
  colorMap: Map<string, string>;
  title: string;
}

export default function ColorLegend({ colorMap, title }: ColorLegendProps) {
  if (colorMap.size === 0) return null;

  return (
    <div className="absolute bottom-20 right-8 bg-white/90 p-4 rounded-lg shadow-lg max-w-xs max-h-[40vh] overflow-y-auto z-10">
      <h3 className="text-sm font-medium mb-2 sticky top-0 bg-white/90">{title}</h3>
      <div className="space-y-1">
        {Array.from(colorMap).map(([value, color]) => (
          <div key={value} className="flex items-center gap-2 text-sm">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{ backgroundColor: color }}
            />
            <span className="truncate">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
