import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isStrongPassword,
} from './validators';

describe('isValidEmail', () => {
  it('should validate correct email formats', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('should reject invalid email formats', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user @example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('should validate correct phone formats', () => {
    expect(isValidPhone('+1234567890')).toBe(true);
    expect(isValidPhone('1234567890')).toBe(true);
    expect(isValidPhone('+44 20 7946 0958')).toBe(true);
  });

  it('should reject invalid phone formats', () => {
    expect(isValidPhone('abc123')).toBe(false);
    expect(isValidPhone('+0123')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });
});

describe('isRequired', () => {
  it('should validate non-empty strings', () => {
    expect(isRequired('text')).toBe(true);
    expect(isRequired('   text   ')).toBe(true);
  });

  it('should reject empty strings', () => {
    expect(isRequired('')).toBe(false);
    expect(isRequired('   ')).toBe(false);
  });

  it('should validate numbers', () => {
    expect(isRequired(0)).toBe(true);
    expect(isRequired(123)).toBe(true);
  });

  it('should validate arrays', () => {
    expect(isRequired([1, 2, 3])).toBe(true);
    expect(isRequired([])).toBe(false);
  });

  it('should validate objects', () => {
    expect(isRequired({ key: 'value' })).toBe(true);
    expect(isRequired({})).toBe(false);
  });

  it('should reject null and undefined', () => {
    expect(isRequired(null)).toBe(false);
    expect(isRequired(undefined)).toBe(false);
  });
});

describe('hasMinLength', () => {
  it('should validate strings meeting minimum length', () => {
    expect(hasMinLength('hello', 5)).toBe(true);
    expect(hasMinLength('hello world', 5)).toBe(true);
  });

  it('should reject strings below minimum length', () => {
    expect(hasMinLength('hi', 5)).toBe(false);
    expect(hasMinLength('', 1)).toBe(false);
  });

  it('should handle exact length', () => {
    expect(hasMinLength('test', 4)).toBe(true);
  });
});

describe('hasMaxLength', () => {
  it('should validate strings within maximum length', () => {
    expect(hasMaxLength('hello', 10)).toBe(true);
    expect(hasMaxLength('test', 4)).toBe(true);
  });

  it('should reject strings exceeding maximum length', () => {
    expect(hasMaxLength('hello world', 5)).toBe(false);
  });

  it('should handle exact length', () => {
    expect(hasMaxLength('test', 4)).toBe(true);
  });
});

describe('isStrongPassword', () => {
  it('should validate strong passwords', () => {
    expect(isStrongPassword('Password1')).toBe(true);
    expect(isStrongPassword('MySecure123')).toBe(true);
    expect(isStrongPassword('Test1234')).toBe(true);
  });

  it('should reject weak passwords', () => {
    expect(isStrongPassword('password')).toBe(false); // no uppercase or number
    expect(isStrongPassword('PASSWORD1')).toBe(false); // no lowercase
    expect(isStrongPassword('Password')).toBe(false); // no number
    expect(isStrongPassword('Pass1')).toBe(false); // too short
    expect(isStrongPassword('')).toBe(false);
  });

  it('should allow special characters', () => {
    expect(isStrongPassword('Password1!')).toBe(true);
    expect(isStrongPassword('Secure@123')).toBe(true);
  });
});
