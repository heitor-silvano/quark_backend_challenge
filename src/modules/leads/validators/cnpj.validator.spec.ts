import { describe, it, expect } from 'vitest';
import { validateCnpj } from './cnpj.validator';

describe('validateCnpj', () => {
  describe('valid CNPJs', () => {
    it('should return true for a valid CNPJ', () => {
      expect(validateCnpj('06990590000123')).toBe(true);
    });

    it('should return true for another valid CNPJ', () => {
      expect(validateCnpj('49014858000102')).toBe(true);
    });
  });

  describe('invalid format', () => {
    it('should return false for CNPJ with less than 14 digits', () => {
      expect(validateCnpj('1234567800019')).toBe(false);
    });

    it('should return false for CNPJ with more than 14 digits', () => {
      expect(validateCnpj('123456780001900')).toBe(false);
    });

    it('should return false for CNPJ with letters', () => {
      expect(validateCnpj('1122233300018A')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(validateCnpj('')).toBe(false);
    });
  });

  describe('repeated digits', () => {
    it('should return false for all zeros', () => {
      expect(validateCnpj('00000000000000')).toBe(false);
    });

    it('should return false for all ones', () => {
      expect(validateCnpj('11111111111111')).toBe(false);
    });

    it('should return false for all nines', () => {
      expect(validateCnpj('99999999999999')).toBe(false);
    });
  });

  describe('invalid verifier digits', () => {
    it('should return false for CNPJ with wrong first verifier digit', () => {
      expect(validateCnpj('11222333000191')).toBe(false);
    });

    it('should return false for CNPJ with wrong second verifier digit', () => {
      expect(validateCnpj('11222333000180')).toBe(false);
    });

    it('should return false for CNPJ with both verifier digits wrong', () => {
      expect(validateCnpj('11222333000100')).toBe(false);
    });
  });
});