'use client';
import { FC } from 'react';

interface TopBarProps {
  exportGraph: () => void;
  importGraph: (file: File) => void;
}

const TopBar: FC<TopBarProps> = ({ exportGraph, importGraph }) => {
  return (
    <div className="bg-white border-b px-4 py-2 flex items-center space-x-4">
      <button
        onClick={exportGraph}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Export Graph
      </button>
      <label className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer">
        Import Graph
        <input
          type="file"
          accept="application/json"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) importGraph(file);
          }}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default TopBar;
