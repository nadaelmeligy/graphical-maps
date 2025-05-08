'use client';
import { FC } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: {
    label: string;
    action: () => void;
  }[];
}

const ContextMenu: FC<ContextMenuProps> = ({ x, y, options, onClose }) => {
  return (
    <>
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div 
        className="absolute z-50 bg-white rounded-lg shadow-xl border overflow-hidden"
        style={{ 
          left: `${x}px`, 
          top: `${y}px`,
          minWidth: '160px'
        }}
      >
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => {
              option.action();
              onClose();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default ContextMenu;
