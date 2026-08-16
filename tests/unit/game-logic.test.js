import { describe, test, expect } from 'vitest';
import { checkGuess, hasRepeats, generateSecretNumberUnique, generateSecretNumberWithRepeats } from '../../game-logic.js';

describe('checkGuess', () => {
  test('returns all bulls when guess exactly matches secret', () => {
    expect(checkGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  test('returns all cows when digits are correct but positions are swapped', () => {
    expect(checkGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  test('returns a mix of bulls and cows', () => {
    expect(checkGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
  });

  test('returns zero bulls and zero cows when no digits match', () => {
    expect(checkGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  test('correctly handles repeated digits in the secret (Beginner mode)', () => {
    // secret has two 1s; guess has two 1s too, but only one is in the right spot
    expect(checkGuess('1123', '1111')).toEqual({ bulls: 2, cows: 0 });
  });

  test('does not overcount cows when guess has more repeats than secret', () => {
    // secret has only one 5; guessing four 5s should count just one cow, no bulls
    expect(checkGuess('5678', '5555')).toEqual({ bulls: 1, cows: 0 });
  });

  test('does not overcount cows or bulls when guess has more repeated digits than secret', () => {
  // secret has two 1s; guess has three 1s
  // First '1' is Bull at index 0, second '1' is Cow for index 1, third '1' should be ignored
  expect(checkGuess('1123', '1411')).toEqual({ bulls: 1, cows: 1 });
});
});

describe('hasRepeats', () => {
  test('returns false when all digits are unique', () => {
    expect(hasRepeats('1234')).toBe(false);
  });

  test('returns true when a digit repeats', () => {
    expect(hasRepeats('1231')).toBe(true);
  });

  test('returns true even with multiple repeated digits', () => {
    expect(hasRepeats('1122')).toBe(true);
  });

  test('returns false for an empty string', () => {
    expect(hasRepeats('')).toBe(false);
  });

  test('returns false for a single character', () => {
    expect(hasRepeats('5')).toBe(false);
  });
});

describe('generateSecretNumberWithRepeats', () => {
  test('returns a 4-character string by default', () => {
    const result = generateSecretNumberWithRepeats();
    expect(result.length).toBe(4);
  });

  test('returns only digit characters', () => {
    for (let i = 0; i < 50; i++) {
      const result = generateSecretNumberWithRepeats();
      expect(/^[0-9]+$/.test(result)).toBe(true);
    }
  });

  test('respects a custom length', () => {
    const result = generateSecretNumberWithRepeats(6);
    expect(result.length).toBe(6);
  });
});

describe('generateSecretNumberUnique', () => {
  test('returns a 4-character string by default', () => {
    const result = generateSecretNumberUnique();
    expect(result.length).toBe(4);
  });

  test('returns only digit characters', () => {
    for (let i = 0; i < 50; i++) {
      const result = generateSecretNumberUnique();
      expect(/^[0-9]+$/.test(result)).toBe(true);
    }
  });

  test('never contains repeated digits', () => {
    for (let i = 0; i < 50; i++) {
      const result = generateSecretNumberUnique();
      expect(hasRepeats(result)).toBe(false);
    }
  });

  test('respects a custom length', () => {
    const result = generateSecretNumberUnique(6);
    expect(result.length).toBe(6);
  });

  test('handles edge case length for unique digits generation', () => {
  // Requesting max available unique digits
  const maxResult = generateSecretNumberUnique(10);
  expect(maxResult.length).toBe(10);
  expect(hasRepeats(maxResult)).toBe(false);
});
});