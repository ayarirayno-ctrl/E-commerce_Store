import { useState, useCallback } from 'react';

/**
 * Custom hook for localStorage operations
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

/**
 * Hook for managing recent searches
 */
export const useRecentSearches = (maxItems: number = 10) => {
  const [searches, setSearches] = useLocalStorage<string[]>('recentSearches', []);

  const addSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== searchTerm.toLowerCase());
      return [searchTerm, ...filtered].slice(0, maxItems);
    });
  }, [setSearches, maxItems]);

  const removeSearch = useCallback((searchTerm: string) => {
    setSearches(prev => prev.filter(item => item !== searchTerm));
  }, [setSearches]);

  const clearSearches = useCallback(() => {
    setSearches([]);
  }, [setSearches]);

  return {
    searches,
    addSearch,
    removeSearch,
    clearSearches,
  };
};

/**
 * Hook for managing user preferences
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage<Record<string, unknown>>('userPreferences', {
    theme: 'light',
    currency: 'USD',
    language: 'en',
    notifications: true,
    autoSave: true,
  });

  const updatePreference = useCallback((key: string, value: unknown) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    setPreferences,
  };
};
