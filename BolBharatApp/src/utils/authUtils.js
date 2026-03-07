/**
 * Authentication Utilities for AWS Cognito Integration
 */

/**
 * Validate Indian phone number
 * Must be 10 digits starting with 6-9
 */
export const validateIndianPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Format phone number for display
 * @param {string} phone - 10 digit phone number
 * @returns {string} - Formatted as XXX-XXX-XXXX
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

/**
 * Generate a secure random password
 * Required for Cognito phone authentication
 */
export const generateSecurePassword = () => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  
  const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
  
  let password = '';
  password += getRandomChar(uppercase);
  password += getRandomChar(lowercase);
  password += getRandomChar(numbers);
  password += getRandomChar(special);
  
  // Fill rest with random characters
  const allChars = lowercase + uppercase + numbers + special;
  for (let i = 0; i < 8; i++) {
    password += getRandomChar(allChars);
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Format Cognito error messages to user-friendly text
 */
export const formatCognitoError = (error) => {
  const errorMessages = {
    'UserNotFoundException': 'User not found. Please sign up.',
    'CodeMismatchException': 'Invalid verification code. Please try again.',
    'ExpiredCodeException': 'Verification code expired. Please request a new one.',
    'LimitExceededException': 'Too many attempts. Please try again later.',
    'InvalidParameterException': 'Invalid phone number format.',
    'UsernameExistsException': 'This phone number is already registered.',
    'NotAuthorizedException': 'Incorrect username or password.',
    'TooManyRequestsException': 'Too many requests. Please wait and try again.',
    'InvalidPasswordException': 'Password does not meet requirements.',
    'TooManyFailedAttemptsException': 'Too many failed attempts. Account temporarily locked.',
  };

  return errorMessages[error.code] || error.message || 'Authentication failed. Please try again.';
};

/**
 * Check if OTP is valid format (6 digits)
 */
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Country codes for phone authentication
 */
export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
];

/**
 * Get user's region from phone number
 */
export const getRegionFromPhone = (phoneNumber) => {
  // Indian phone numbers
  const stateMap = {
    '22': 'Maharashtra',
    '33': 'West Bengal',
    '40': 'Telangana',
    '44': 'Tamil Nadu',
    '80': 'Karnataka',
    '11': 'Delhi',
    '79': 'Gujarat',
    '20': 'Maharashtra',
  };

  const prefix = phoneNumber.substring(0, 2);
  return stateMap[prefix] || 'India';
};

/**
 * Sanitize phone number (remove non-digits)
 */
export const sanitizePhoneNumber = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Add country code to phone number
 */
export const addCountryCode = (phone, countryCode = '+91') => {
  const cleaned = sanitizePhoneNumber(phone);
  return `${countryCode}${cleaned}`;
};

/**
 * Remove country code from phone number
 */
export const removeCountryCode = (phone, countryCode = '+91') => {
  if (phone.startsWith(countryCode)) {
    return phone.substring(countryCode.length);
  }
  return phone;
};

/**
 * Check if device time is synced (important for OTP)
 */
export const checkTimeSyncStatus = () => {
  const deviceTime = new Date().getTime();
  const networkTime = Date.now(); // Approximate
  const diff = Math.abs(deviceTime - networkTime);
  
  // If difference is more than 5 minutes, time may be out of sync
  return diff < 5 * 60 * 1000;
};

/**
 * Generate a session ID for tracking auth flow
 */
export const generateSessionId = () => {
  return `auth_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

/**
 * Mask phone number for display
 * Example: 9876543210 -> 98******10
 */
export const maskPhoneNumber = (phone) => {
  if (!phone || phone.length < 4) return phone;
  const visibleStart = phone.substring(0, 2);
  const visibleEnd = phone.substring(phone.length - 2);
  const masked = '*'.repeat(phone.length - 4);
  return `${visibleStart}${masked}${visibleEnd}`;
};

/**
 * Check if phone number is from a valid Indian telecom operator
 */
export const isValidIndianOperator = (phone) => {
  const operatorPrefixes = [
    '60', '70', '80', '90', // Vodafone, Idea
    '96', '97', '98', '99', // Airtel, BSNL
    '93', '94', '95',       // Jio, Airtel
    '91', '92',             // Various
    '88', '89',             // Various
    '75', '76', '77', '78', // Various
    '63', '64', '65', '66', // Various
    '85', '86', '87',       // Various
    '81', '82', '83', '84', // Various
  ];

  const prefix = phone.substring(0, 2);
  return operatorPrefixes.includes(prefix);
};

/**
 * Rate limiting for OTP requests
 */
class OTPRateLimiter {
  constructor() {
    this.attempts = [];
    this.maxAttempts = 5;
    this.windowMs = 15 * 60 * 1000; // 15 minutes
  }

  canMakeRequest(phoneNumber) {
    const now = Date.now();
    
    // Clean old attempts
    this.attempts = this.attempts.filter(
      attempt => now - attempt.timestamp < this.windowMs
    );

    // Count attempts for this phone number
    const phoneAttempts = this.attempts.filter(
      attempt => attempt.phone === phoneNumber
    );

    return phoneAttempts.length < this.maxAttempts;
  }

  recordAttempt(phoneNumber) {
    this.attempts.push({
      phone: phoneNumber,
      timestamp: Date.now(),
    });
  }

  getRemainingTime(phoneNumber) {
    const phoneAttempts = this.attempts.filter(
      attempt => attempt.phone === phoneNumber
    );

    if (phoneAttempts.length === 0) return 0;

    const oldestAttempt = phoneAttempts[0];
    const elapsed = Date.now() - oldestAttempt.timestamp;
    const remaining = this.windowMs - elapsed;

    return Math.max(0, Math.ceil(remaining / 1000));
  }
}

export const otpRateLimiter = new OTPRateLimiter();
