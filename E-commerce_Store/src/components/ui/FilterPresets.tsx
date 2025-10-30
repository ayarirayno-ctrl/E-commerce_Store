import React, { useState, useEffect } from 'react';
import { Save, Trash2, Plus } from 'lucide-react';

export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  createdAt: string;
}

interface FilterPresetsProps {
  storageKey: string;
  currentFilters: Record<string, unknown>;
  onApplyPreset: (filters: Record<string, unknown>) => void;
}

const FilterPresets: React.FC<FilterPresetsProps> = ({
  storageKey,
  currentFilters,
  onApplyPreset,
}) => {
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setPresets(JSON.parse(saved));
    }
  }, [storageKey]);

  const savePreset = () => {
    if (!presetName.trim()) return;

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName,
      filters: currentFilters,
      createdAt: new Date().toISOString(),
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setPresetName('');
    setShowSaveModal(false);
  };

  const deletePreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Filtres sauvegardés
        </label>
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Sauvegarder
        </button>
      </div>

      {presets.length > 0 ? (
        <div className="space-y-2">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <button
                onClick={() => onApplyPreset(preset.filters)}
                className="flex-1 text-left"
              >
                <div className="font-medium text-gray-900 dark:text-white">{preset.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(preset.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </button>
              <button
                onClick={() => deletePreset(preset.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          Aucun filtre sauvegardé
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Sauvegarder les filtres
            </h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Nom du preset..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setPresetName('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={savePreset}
                disabled={!presetName.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPresets;
