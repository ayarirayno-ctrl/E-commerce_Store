import React from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

interface VoiceSearchButtonProps {
  onVoiceResult: (text: string) => void;
  className?: string;
  language?: string;
}

/**
 * Bouton de recherche vocale avec feedback visuel
 * Utilise l'API Web Speech Recognition
 */
export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onVoiceResult,
  className = '',
  language = 'fr-FR',
}) => {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceSearch(onVoiceResult, language);

  // Si non supporté, ne rien afficher
  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className={`
          p-2 rounded-lg transition-all duration-200 
          ${isListening 
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }
          ${className}
        `}
        title={isListening ? 'Stop listening' : 'Start voice search'}
        aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
      >
        {isListening ? (
          <div className="flex items-center space-x-1">
            <MicOff className="h-5 w-5" />
            <span className="text-xs font-medium">Listening...</span>
          </div>
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>

      {/* Transcript en temps réel */}
      {isListening && transcript && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 z-50 min-w-[200px]">
          <div className="flex items-start space-x-2">
            <Loader className="h-4 w-4 text-primary-600 animate-spin flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {transcript}
            </p>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-lg p-3 border border-red-200 dark:border-red-800 z-50 min-w-[200px]">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};
