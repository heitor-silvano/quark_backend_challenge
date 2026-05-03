import { registerDecorator, ValidationOptions } from 'class-validator';

function hasOnlyRepeatedDigits(cnpj: string): boolean {
  return /^(\d)\1{13}$/.test(cnpj);
}

function calculateVerifierDigit(cnpj: string, length: number): number {
  let sum = 0;
  let pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(cnpj.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  return sum % 11 < 2 ? 0 : 11 - (sum % 11);
}

export function validateCnpj(cnpj: string): boolean {
  if (!/^\d{14}$/.test(cnpj)) return false;
  if (hasOnlyRepeatedDigits(cnpj)) return false;

  const firstDigit = calculateVerifierDigit(cnpj, 12);
  if (firstDigit !== parseInt(cnpj.charAt(12))) return false;

  const secondDigit = calculateVerifierDigit(cnpj, 13);
  if (secondDigit !== parseInt(cnpj.charAt(13))) return false;

  return true;
}

export function IsValidCnpj(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidCnpj',
      target: object.constructor,
      propertyName,
      options: {
        message: 'companyCnpj must be a valid CNPJ',
        ...options,
      },
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && validateCnpj(value);
        },
      },
    });
  };
}