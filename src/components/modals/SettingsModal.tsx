import { Topology } from '../../utils/topologyLayouts';
import { useDraggable } from '../../hooks/useDraggable';

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
    defaultEdgeType: EdgeType;
  };
  onSettingsChange: (settings: {
    showLinkCount: boolean;
    showCategory: boolean;
    layout: 'force' | 'radial' | 'hierarchical' | 'circular';
    linkDistance: number;
    chargeStrength: number;
    topology: Topology;
    showArrows: boolean;
    defaultEdgeType: EdgeType;
  }) => void;
}

export default function SettingsModal({ onClose, settings, onSettingsChange }: SettingsModalProps) {
  const { position, dragHandlers } = useDraggable('drag-handle');

  const handleSettingChange = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const SettingSection = ({ title, description, children }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-y-auto shadow-xl"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        {...dragHandlers}
      >
        <div 
          className="p-4 bg-gray-100 rounded-t-lg border-b flex justify-between items-center drag-handle"
          style={{ cursor: 'move' }}
        >
          <h2 className="text-xl font-bold text-gray-900 select-none drag-handle">Graph Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6" style={{ cursor: 'default' }}>
          <div className="space-y-6">
            <SettingSection 
              title="Layout Settings" 
              description="Configure how nodes are arranged and interact"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Layout Type
                  </label>
                  <select
                    value={settings.layout}
                    onChange={(e) => handleSettingChange('layout', e.target.value as typeof settings.layout)}
                    className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
                  >
                    <option value="force">Force-Directed</option>
                    <option value="radial">Radial</option>
                    <option value="hierarchical">Hierarchical</option>
                    <option value="circular">Circular</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Topology
                  </label>
                  <select
                    value={settings.topology}
                    onChange={(e) => handleSettingChange('topology', e.target.value as Topology)}
                    className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
                  >
                    <option value="free">Free Layout</option>
                    <option value="star">Star Network</option>
                    <option value="ring">Ring Network</option>
                    <option value="grid">Grid Network</option>
                    <option value="tree">Tree Network</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex justify-between mb-1">
                    Link Distance
                    <span className="text-gray-500">{settings.linkDistance}px</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={settings.linkDistance}
                    onChange={(e) => handleSettingChange('linkDistance', Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 flex justify-between mb-1">
                    Force Strength
                    <span className="text-gray-500">{settings.chargeStrength}</span>
                  </label>
                  <input
                    type="range"
                    min="-300"
                    max="-30"
                    value={settings.chargeStrength}
                    onChange={(e) => handleSettingChange('chargeStrength', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </SettingSection>

            <SettingSection 
              title="Visual Settings"
              description="Configure the appearance of nodes and connections"
            >
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Default Edge Type
                  </label>
                  <select
                    value={settings.defaultEdgeType}
                    onChange={(e) => handleSettingChange('defaultEdgeType', e.target.value as EdgeType)}
                    className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
                  >
                    <option value="line">Simple Line</option>
                    <option value="arrow">Directional Arrow</option>
                    <option value="dashed">Dashed Line</option>
                    <option value="dotted">Dotted Line</option>
                    <option value="bidirectional">Bidirectional Arrow</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Show Connection Count
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.showLinkCount}
                    onChange={(e) => handleSettingChange('showLinkCount', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Show Category Labels
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.showCategory}
                    onChange={(e) => handleSettingChange('showCategory', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Show Edge Arrows
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.showArrows}
                    onChange={(e) => handleSettingChange('showArrows', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            </SettingSection>
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
    </div>
  );
}
