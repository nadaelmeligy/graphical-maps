import { useState } from "react";

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
  onConfirm: (includeLabels: boolean) => void;
}

export default function ImagePreviewModal({ imageUrl, onClose, onConfirm }: ImagePreviewModalProps) {
  const [includeLabels, setIncludeLabels] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
      <div className="bg-white p-6 rounded-lg max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold mb-4">Preview Export</h2>
        
        <div className="overflow-auto flex-1 border rounded-lg p-2 bg-gray-50">
          <img src={imageUrl} alt="Graph Preview" className="max-w-full" />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="includeLabels"
            checked={includeLabels}
            onChange={(e) => setIncludeLabels(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="includeLabels" className="text-sm text-gray-600">
            Include node labels
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(includeLabels)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
