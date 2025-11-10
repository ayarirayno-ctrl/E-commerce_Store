import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour la reconnaissance vocale (Web Speech API)
 * Permet d'utiliser la voix pour effectuer des recherches
 */

interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}

interface UseVoiceSearchReturn extends VoiceRecognitionState {
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

// Vérifier si l'API est supportée
const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const useVoiceSearch = (
  onResult?: (transcript: string) => void,
  language: string = 'fr-FR'
): UseVoiceSearchReturn => {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    error: null,
    isSupported: isSpeechRecognitionSupported(),
  });

  const [recognition, setRecognition] = useState<{
    start: () => void;
    stop: () => void;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
  } | null>(null);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    if (!state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: 'Voice search is not supported in this browser' 
      }));
      return;
    }

    const SpeechRecognition = (window as unknown as any).SpeechRecognition || (window as unknown as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setState(prev => ({ 
        ...prev, 
        error: 'Voice recognition not available' 
      }));
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = false; // Arrêter après une phrase
    recognitionInstance.interimResults = true; // Résultats intermédiaires
    recognitionInstance.lang = language;
    recognitionInstance.maxAlternatives = 1;

    // Événement: Résultat de reconnaissance
    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      const isFinal = event.results[current].isFinal;

      setState(prev => ({ ...prev, transcript, error: null }));

      // Si résultat final, appeler le callback
      if (isFinal && onResult) {
        onResult(transcript);
      }
    };

    // Événement: Erreur
    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Voice recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not available.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied.';
          break;
        case 'network':
          errorMessage = 'Network error occurred.';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }

      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isListening: false 
      }));
    };

    // Événement: Fin de reconnaissance
    recognitionInstance.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    // Événement: Début de reconnaissance
    recognitionInstance.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    setRecognition(recognitionInstance);

    // Cleanup
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [state.isSupported, language, onResult]);

  // Démarrer l'écoute
  const startListening = useCallback(() => {
    if (!recognition) return;

    try {
      recognition.start();
      setState(prev => ({ ...prev, transcript: '', error: null }));
    } catch (err) {
      console.error('Failed to start voice recognition:', err);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to start voice recognition' 
      }));
    }
  }, [recognition]);

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (!recognition) return;

    try {
      recognition.stop();
    } catch (err) {
      console.error('Failed to stop voice recognition:', err);
    }
  }, [recognition]);

  // Réinitialiser le transcript
  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', error: null }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
};
