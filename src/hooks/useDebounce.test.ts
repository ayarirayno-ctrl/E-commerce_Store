import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDebounce } from './useDebounce';

// Mock timers
beforeEach(() => {
  vi.useFakeTimers();
});

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Still old value

    // Fast-forward time by 250ms (not enough)
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('initial'); // Still old value

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('updated'); // Now updated
  });

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'change1' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: 'change2' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should still be initial because timer keeps resetting
    expect(result.current).toBe('initial');

    // Complete the delay
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('change2');
  });

  it('should use default delay of 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });

  it('should work with different data types', () => {
    // Number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 0 } }
    );

    numberRerender({ value: 42 });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(numberResult.current).toBe(42);

    // Boolean
    const { result: boolResult, rerender: boolRerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: false } }
    );

    boolRerender({ value: true });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(boolResult.current).toBe(true);

    // Object
    const { result: objResult, rerender: objRerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: { name: 'initial' } } }
    );

    objRerender({ value: { name: 'updated' } });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(objResult.current).toEqual({ name: 'updated' });
  });

  it('should handle empty string', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'text' } }
    );

    rerender({ value: '' });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('');
  });

  it('should cleanup timer on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('value', 500));
    
    // Should not throw
    expect(() => unmount()).not.toThrow();
    
    // Cleanup test - advance timers after unmount should not cause issues
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  });
});
