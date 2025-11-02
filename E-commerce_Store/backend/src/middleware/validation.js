/**
 * Input validation middleware
 * Validates and sanitizes user inputs to prevent XSS, injection, and malformed data
 */

import validator from 'validator';

/**
 * Validate email address
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' };
  }
  
  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  
  // Normalize email
  const normalizedEmail = validator.normalizeEmail(email);
  return { valid: true, email: normalizedEmail };
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  
  if (password.length > 100) {
    return { valid: false, message: 'Password is too long' };
  }
  
  // Check for at least one number and one letter
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  
  if (!hasNumber || !hasLetter) {
    return { valid: false, message: 'Password must contain letters and numbers' };
  }
  
  return { valid: true };
};

/**
 * Validate and sanitize name (first name, last name, etc.)
 */
export const validateName = (name, fieldName = 'Name') => {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: `${fieldName} is required` };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { valid: false, message: `${fieldName} must be at least 2 characters` };
  }
  
  if (trimmedName.length > 50) {
    return { valid: false, message: `${fieldName} is too long (max 50 characters)` };
  }
  
  // Only allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedName)) {
    return { valid: false, message: `${fieldName} contains invalid characters` };
  }
  
  // Escape HTML to prevent XSS
  const sanitizedName = validator.escape(trimmedName);
  return { valid: true, name: sanitizedName };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone, required = false) => {
  if (!phone || phone === '') {
    if (required) {
      return { valid: false, message: 'Phone number is required' };
    }
    return { valid: true, phone: '' };
  }
  
  if (typeof phone !== 'string') {
    return { valid: false, message: 'Invalid phone number format' };
  }
  
  // Remove spaces and special characters for validation
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  
  if (!validator.isMobilePhone(cleanPhone, 'any', { strictMode: false })) {
    return { valid: false, message: 'Invalid phone number' };
  }
  
  return { valid: true, phone: cleanPhone };
};

/**
 * Validate address field
 */
export const validateAddress = (address, fieldName = 'Address') => {
  if (!address || typeof address !== 'string') {
    return { valid: false, message: `${fieldName} is required` };
  }
  
  const trimmedAddress = address.trim();
  
  if (trimmedAddress.length < 5) {
    return { valid: false, message: `${fieldName} is too short` };
  }
  
  if (trimmedAddress.length > 200) {
    return { valid: false, message: `${fieldName} is too long` };
  }
  
  // Escape HTML
  const sanitizedAddress = validator.escape(trimmedAddress);
  return { valid: true, address: sanitizedAddress };
};

/**
 * Validate postal code
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode || typeof postalCode !== 'string') {
    return { valid: false, message: 'Postal code is required' };
  }
  
  const trimmed = postalCode.trim();
  
  if (trimmed.length < 3 || trimmed.length > 10) {
    return { valid: false, message: 'Invalid postal code format' };
  }
  
  // Allow alphanumeric and spaces/hyphens
  if (!/^[A-Z0-9\s-]+$/i.test(trimmed)) {
    return { valid: false, message: 'Postal code contains invalid characters' };
  }
  
  return { valid: true, postalCode: trimmed.toUpperCase() };
};

/**
 * Validate price
 */
export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return { valid: false, message: 'Invalid price format' };
  }
  
  if (numPrice < 0) {
    return { valid: false, message: 'Price cannot be negative' };
  }
  
  if (numPrice > 1000000) {
    return { valid: false, message: 'Price is too high' };
  }
  
  return { valid: true, price: numPrice };
};

/**
 * Validate quantity
 */
export const validateQuantity = (quantity) => {
  const numQuantity = parseInt(quantity);
  
  if (isNaN(numQuantity)) {
    return { valid: false, message: 'Invalid quantity format' };
  }
  
  if (numQuantity < 1) {
    return { valid: false, message: 'Quantity must be at least 1' };
  }
  
  if (numQuantity > 1000) {
    return { valid: false, message: 'Quantity is too high (max 1000)' };
  }
  
  return { valid: true, quantity: numQuantity };
};

/**
 * Validate MongoDB ObjectId
 */
export const validateObjectId = (id) => {
  if (!id || typeof id !== 'string') {
    return { valid: false, message: 'ID is required' };
  }
  
  if (!validator.isMongoId(id)) {
    return { valid: false, message: 'Invalid ID format' };
  }
  
  return { valid: true };
};

/**
 * Validate URL
 */
export const validateURL = (url, required = false) => {
  if (!url || url === '') {
    if (required) {
      return { valid: false, message: 'URL is required' };
    }
    return { valid: true, url: '' };
  }
  
  if (!validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
    return { valid: false, message: 'Invalid URL format' };
  }
  
  return { valid: true, url };
};

/**
 * Sanitize general text input (descriptions, comments, etc.)
 */
export const sanitizeText = (text, maxLength = 1000) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  let sanitized = text.trim();
  
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Escape HTML to prevent XSS
  sanitized = validator.escape(sanitized);
  
  return sanitized;
};

/**
 * Validate registration data
 */
export const validateRegistrationData = (data) => {
  const errors = [];
  const validated = {};
  
  // Validate email
  const emailCheck = validateEmail(data.email);
  if (!emailCheck.valid) {
    errors.push(emailCheck.message);
  } else {
    validated.email = emailCheck.email;
  }
  
  // Validate password
  const passwordCheck = validatePassword(data.password);
  if (!passwordCheck.valid) {
    errors.push(passwordCheck.message);
  }
  
  // Validate first name
  const firstNameCheck = validateName(data.firstName, 'First name');
  if (!firstNameCheck.valid) {
    errors.push(firstNameCheck.message);
  } else {
    validated.firstName = firstNameCheck.name;
  }
  
  // Validate last name
  const lastNameCheck = validateName(data.lastName, 'Last name');
  if (!lastNameCheck.valid) {
    errors.push(lastNameCheck.message);
  } else {
    validated.lastName = lastNameCheck.name;
  }
  
  // Validate phone (optional)
  if (data.phone) {
    const phoneCheck = validatePhone(data.phone, false);
    if (!phoneCheck.valid) {
      errors.push(phoneCheck.message);
    } else {
      validated.phone = phoneCheck.phone;
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data: validated
  };
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateAddress,
  validatePostalCode,
  validatePrice,
  validateQuantity,
  validateObjectId,
  validateURL,
  sanitizeText,
  validateRegistrationData
};
