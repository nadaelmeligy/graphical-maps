import { useState } from 'react';

interface ExportToolsProps {
  onExportImage: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

export function ExportTools({ onExportImage, onExportData, onImportData }: ExportToolsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportImage = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await onExportImage();
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportImage}
        disabled={isExporting}
        className={`
          px-3 py-1 text-sm bg-yellow-500 text-white rounded transition
          ${isExporting 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-yellow-600'}
        `}
      >
        {isExporting ? 'Exporting...' : 'Export Image'}
      </button>
      <button
        onClick={onExportData}
        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Export Data
      </button>
      <label className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer">
        Import Data
        <input
          type="file"
          accept="application/json"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) onImportData(file);
          }}
          className="hidden"
        />
      </label>
    </div>
  );
}
