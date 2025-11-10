// Type definitions pour corriger les erreurs TypeScript// Type definitions pour corriger les erreurs TypeScript



declare module '*.tsx' {declare module '*.tsx' {

  const component: React.ComponentType;  const component: React.ComponentType;

  export default component;  export default component;

}}



declare module '../components/ui/Loading' {declare module '../components/ui/Loading' {

  const Loading: React.ComponentType;  const Loading: React.ComponentType;

  export default Loading;  export default Loading;

}}



// Amélioration des types globaux React
declare global {
  namespace React {
    interface FunctionComponent<_P = Record<string, never>> {
      propTypes?: Record<string, unknown>;
    }
  }
  
  interface Window {
    webkitSpeechRecognition?: unknown;
    SpeechRecognition?: unknown;
  }
}

// Module declarations
declare module '*.tsx' {
  const component: React.ComponentType;
  export default component;
}

export {};
