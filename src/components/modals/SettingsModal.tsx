interface SettingsModalProps {
  onClose: () => void;
  settings: {
    showLinkCount: boolean;
    showCategory: boolean;
  };
  onSettingsChange: (settings: { showLinkCount: boolean; showCategory: boolean }) => void;
}

export default function SettingsModal({ onClose, settings, onSettingsChange }: SettingsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700">Show Connection Count</label>
            <input
              type="checkbox"
              checked={settings.showLinkCount}
              onChange={(e) => onSettingsChange({ 
                ...settings, 
                showLinkCount: e.target.checked 
              })}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-700">Show Category</label>
            <input
              type="checkbox"
              checked={settings.showCategory}
              onChange={(e) => onSettingsChange({ 
                ...settings, 
                showCategory: e.target.checked 
              })}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
