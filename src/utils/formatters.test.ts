import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatPercentage,
  formatRating,
  formatNumber,
  formatDate,
  truncateText,
  capitalizeWords,
  generateId,
} from './formatters';

describe('formatPrice', () => {
  it('should format price in USD by default', () => {
    expect(formatPrice(999)).toBe('$999.00');
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('should format price with zero value', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should handle negative values', () => {
    expect(formatPrice(-50)).toBe('-$50.00');
  });

  it('should format price with different currency', () => {
    const result = formatPrice(100, 'EUR');
    expect(result).toContain('100');
  });
});

describe('formatPercentage', () => {
  it('should format percentage as integer', () => {
    expect(formatPercentage(10)).toBe('10%');
    expect(formatPercentage(25.7)).toBe('26%');
  });

  it('should round to nearest integer', () => {
    expect(formatPercentage(15.4)).toBe('15%');
    expect(formatPercentage(15.6)).toBe('16%');
  });

  it('should handle zero', () => {
    expect(formatPercentage(0)).toBe('0%');
  });
});

describe('formatRating', () => {
  it('should format rating with stars', () => {
    expect(formatRating(5)).toBe('★★★★★');
    expect(formatRating(4)).toBe('★★★★☆');
    expect(formatRating(3)).toBe('★★★☆☆');
    expect(formatRating(2)).toBe('★★☆☆☆');
    expect(formatRating(1)).toBe('★☆☆☆☆');
    expect(formatRating(0)).toBe('☆☆☆☆☆');
  });

  it('should handle decimal ratings', () => {
    expect(formatRating(4.7)).toBe('★★★★☆');
    expect(formatRating(3.2)).toBe('★★★☆☆');
  });
});

describe('formatNumber', () => {
  it('should format numbers less than 1000 as-is', () => {
    expect(formatNumber(500)).toBe('500');
    expect(formatNumber(999)).toBe('999');
  });

  it('should format thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(5500)).toBe('5.5K');
    expect(formatNumber(999000)).toBe('999.0K');
  });

  it('should format millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(2500000)).toBe('2.5M');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatDate', () => {
  it('should format date from string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('should format date from Date object', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});

describe('truncateText', () => {
  it('should not truncate text shorter than max length', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('should truncate text longer than max length', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
    expect(truncateText('This is a long text', 10)).toBe('This is a ...');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('should handle exact length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });
});

describe('capitalizeWords', () => {
  it('should capitalize first letter of each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
    expect(capitalizeWords('the quick brown fox')).toBe('The Quick Brown Fox');
  });

  it('should handle single word', () => {
    expect(capitalizeWords('hello')).toBe('Hello');
  });

  it('should handle already capitalized text', () => {
    expect(capitalizeWords('Hello World')).toBe('Hello World');
  });

  it('should handle mixed case', () => {
    expect(capitalizeWords('hElLo WoRlD')).toBe('HElLo WoRlD');
  });
});

describe('generateId', () => {
  it('should generate a string ID', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate IDs of consistent length', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1.length).toBe(id2.length);
  });
});
