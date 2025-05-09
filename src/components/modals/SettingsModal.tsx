import { Topology } from '../../utils/topologyLayouts';

interface SettingsModalProps {
  onClose: () => void;
  settings: {
    showLinkCount: boolean;
    showCategory: boolean;
    layout: 'force' | 'radial' | 'hierarchical' | 'circular';
    linkDistance: number;
    chargeStrength: number;
    topology: Topology;
    showArrows: boolean;
  };
  onSettingsChange: (settings: {
    showLinkCount: boolean;
    showCategory: boolean;
    layout: 'force' | 'radial' | 'hierarchical' | 'circular';
    linkDistance: number;
    chargeStrength: number;
    topology: Topology;
    showArrows: boolean;
  }) => void;
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

          <div className="space-y-2">
            <label className="text-gray-700 block">Network Layout</label>
            <select
              value={settings.layout}
              onChange={(e) => onSettingsChange({
                ...settings,
                layout: e.target.value as typeof settings.layout
              })}
              className="w-full border rounded px-2 py-1"
            >
              <option value="force">Force-Directed</option>
              <option value="radial">Radial</option>
              <option value="hierarchical">Hierarchical</option>
              <option value="circular">Circular</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block">Link Distance</label>
            <input
              type="range"
              min="50"
              max="300"
              value={settings.linkDistance}
              onChange={(e) => onSettingsChange({
                ...settings,
                linkDistance: Number(e.target.value)
              })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block">Force Strength</label>
            <input
              type="range"
              min="-300"
              max="-30"
              value={settings.chargeStrength}
              onChange={(e) => onSettingsChange({
                ...settings,
                chargeStrength: Number(e.target.value)
              })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block font-medium">Network Topology</label>
            <select
              value={settings.topology}
              onChange={(e) => onSettingsChange({
                ...settings,
                topology: e.target.value as Topology
              })}
              className="w-full border-2 border-blue-500 rounded-md px-3 py-2 bg-blue-50 
                         text-blue-700 font-medium shadow-sm hover:border-blue-600 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500"
            >
              <option value="free">Free Layout</option>
              <option value="star">Star Network</option>
              <option value="ring">Ring Network</option>
              <option value="grid">Grid Network</option>
              <option value="tree">Tree Network</option>
              <option value="sphere">Sphere Layout</option>
              <option value="cube">Cube Layout</option>
              <option value="helix">Helix Layout</option>
              <option value="spiral">Spiral Layout</option>
              <option value="clusters">Clustered Network</option>
            </select>
            <p className="text-sm text-blue-600 font-medium mt-1">
              Choose a specific network topology to organize nodes
            </p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-700">Show Camera Controls</label>
            <input
              type="checkbox"
              checked={settings.showArrows}
              onChange={(e) => onSettingsChange({ 
                ...settings, 
                showArrows: e.target.checked 
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
