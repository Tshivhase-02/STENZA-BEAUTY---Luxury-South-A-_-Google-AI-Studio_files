/**
 * STENZA BEAUTY - Identity Document Verification Utilities
 * 
 * Supports:
 * 1. South African National ID (13 digits with calendar date, gender range & Luhn checksum)
 * 2. International Passport (alphanumeric, trimmed, length & character validation without SA ID rules)
 * 
 * Privacy:
 * - ID and Passport numbers are never logged or exposed in client telemetry.
 */

export interface IdValidationResult {
  valid: boolean;
  error?: string;
  documentType: 'SA_ID' | 'PASSPORT';
  gender?: 'Female' | 'Male';
  citizenship?: 'South African Citizen' | 'Permanent Resident';
  dateOfBirthFormatted?: string;
  sanitizedValue: string;
}

/**
 * Validates a 13-digit South African National Identity Number.
 * 
 * Formula:
 * - Exactly 13 digits
 * - Calendar date: YYMMDD
 * - Gender indicator: 0000-4999 (Female), 5000-9999 (Male)
 * - Citizenship indicator: 0 (SA Citizen), 1 (Permanent Resident)
 * - Checksum: Official DHA Luhn algorithm
 */
export function validateSouthAfricanId(rawId: string): IdValidationResult {
  const clean = (rawId || '').replace(/\s+/g, '');

  if (!clean) {
    return {
      valid: false,
      error: 'South African ID number is required.',
      documentType: 'SA_ID',
      sanitizedValue: '',
    };
  }

  if (!/^\d{13}$/.test(clean)) {
    return {
      valid: false,
      error: 'South African ID must contain exactly 13 numeric digits.',
      documentType: 'SA_ID',
      sanitizedValue: clean,
    };
  }

  // Extract date components
  const yy = parseInt(clean.slice(0, 2), 10);
  const mm = parseInt(clean.slice(2, 4), 10);
  const dd = parseInt(clean.slice(4, 6), 10);

  if (mm < 1 || mm > 12) {
    return {
      valid: false,
      error: `Invalid month (${clean.slice(2, 4)}) in South African ID. Must be between 01 and 12.`,
      documentType: 'SA_ID',
      sanitizedValue: clean,
    };
  }

  // Calculate century: current year 2026. If yy > 26, 1900s, else 2000s
  const fullYear = yy > 26 ? 1900 + yy : 2000 + yy;
  const isLeapYear = (fullYear % 4 === 0 && fullYear % 100 !== 0) || fullYear % 400 === 0;
  const daysInMonths = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDays = daysInMonths[mm - 1];

  if (dd < 1 || dd > maxDays) {
    return {
      valid: false,
      error: `Invalid calendar day (${clean.slice(4, 6)}) for month ${mm} in South African ID.`,
      documentType: 'SA_ID',
      sanitizedValue: clean,
    };
  }

  // Gender indicator (digits 7-10)
  const genderCode = parseInt(clean.slice(6, 10), 10);
  const gender = genderCode < 5000 ? 'Female' : 'Male';

  // Citizenship indicator (digit 11)
  const citizenshipCode = clean[10];
  const citizenship = citizenshipCode === '0' ? 'South African Citizen' : 'Permanent Resident';

  // Checksum calculation (Official DHA algorithm)
  let sumA = 0;
  for (let i = 0; i < 11; i += 2) {
    sumA += parseInt(clean[i], 10);
  }

  let evenDigits = '';
  for (let i = 1; i < 12; i += 2) {
    evenDigits += clean[i];
  }

  const doubled = (parseInt(evenDigits, 10) * 2).toString();
  let sumB = 0;
  for (let i = 0; i < doubled.length; i++) {
    sumB += parseInt(doubled[i], 10);
  }

  const total = sumA + sumB;
  const expectedChecksum = (10 - (total % 10)) % 10;
  const actualChecksum = parseInt(clean[12], 10);

  if (actualChecksum !== expectedChecksum) {
    return {
      valid: false,
      error: 'Invalid South African ID checksum. Please verify all 13 digits.',
      documentType: 'SA_ID',
      sanitizedValue: clean,
    };
  }

  return {
    valid: true,
    documentType: 'SA_ID',
    gender,
    citizenship,
    dateOfBirthFormatted: `${dd.toString().padStart(2, '0')}/${mm.toString().padStart(2, '0')}/${fullYear}`,
    sanitizedValue: clean,
  };
}

/**
 * Validates a Passport Number.
 * 
 * Rules:
 * - Trims accidental leading/trailing whitespace without changing the value
 * - Standard alphanumeric characters (letters and digits, no symbols/spaces)
 * - Length between 6 and 12 characters (inclusive)
 * - Does NOT apply SA ID date of birth, gender, or Luhn checksum rules
 */
export function validatePassport(rawPassport: string): IdValidationResult {
  const trimmed = (rawPassport || '').trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Passport number is required.',
      documentType: 'PASSPORT',
      sanitizedValue: '',
    };
  }

  if (trimmed.length < 6 || trimmed.length > 12) {
    return {
      valid: false,
      error: 'Passport number must be between 6 and 12 characters in length.',
      documentType: 'PASSPORT',
      sanitizedValue: trimmed,
    };
  }

  if (!/^[A-Za-z0-9]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Passport number may only contain letters and numbers (no special characters or spaces).',
      documentType: 'PASSPORT',
      sanitizedValue: trimmed,
    };
  }

  return {
    valid: true,
    documentType: 'PASSPORT',
    sanitizedValue: trimmed.toUpperCase(),
  };
}

/**
 * Validates either an SA ID or Passport based on the selected document type.
 */
export function validateIdentityDocument(
  docType: 'SA_ID' | 'PASSPORT',
  value: string
): IdValidationResult {
  if (docType === 'SA_ID') {
    return validateSouthAfricanId(value);
  }
  return validatePassport(value);
}
