import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility function', () => {
  it('should merge multiple class names', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('should filter out falsy values', () => {
    expect(cn('class1', false, 'class2', null, undefined, 'class3')).toBe('class1 class2 class3');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('', null, undefined)).toBe('');
  });

  it('should handle numbers', () => {
    expect(cn('class1', 123, 'class2')).toBe('class1 123 class2');
  });

  it('should handle nested arrays', () => {
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
    expect(cn(['class1', ['class2', 'class3']])).toBe('class1 class2 class3');
  });

  it('should filter falsy values in nested arrays', () => {
    expect(cn('class1', ['class2', false, 'class3', null])).toBe('class1 class2 class3');
  });

  it('should handle complex mixed inputs', () => {
    expect(cn(
      'base-class',
      true && 'conditional-class',
      false && 'hidden-class',
      ['nested', 'classes'],
      null,
      undefined
    )).toBe('base-class conditional-class nested classes');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn(
      'button',
      isActive && 'active',
      isDisabled && 'disabled'
    )).toBe('button active');
  });

  it('should filter out zero (falsy)', () => {
    // 0 is filtered out as a falsy value
    expect(cn(false, null, undefined, '', 0)).toBe('');
  });

  it('should handle single class name', () => {
    expect(cn('single-class')).toBe('single-class');
  });
});
