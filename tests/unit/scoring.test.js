import { describe, test, expect } from 'vitest';
import { calculateScore } from '../../game-logic.js';

describe('Scoring Logic Unit Tests', () => {
  test('calculates correct score for standard win scenario', () => {
    // Base: 5000, Speed: 100s * 10 = 1000, Attempts: 5 -> (5-1)*150 = 600 penalty, Hints: 1 -> 1000 penalty
    const score = calculateScore(100, 5, 1);
    expect(score).toBe(4400);
  });

  test('calculates maximum score for a perfect fast game', () => {
    // Base: 5000, Speed: 240s * 10 = 2400, Attempts: 1 (0 penalty), Hints: 0
    const score = calculateScore(240, 1, 0);
    expect(score).toBe(7400);
  });

  test('applies hint penalties correctly', () => {
    // Base: 5000, Speed: 50s * 10 = 500, Attempts: 2 -> 150 penalty, Hints: 2 -> 2000 penalty
    const score = calculateScore(50, 2, 2);
    expect(score).toBe(3350);
  });

  test('ensures score never drops below zero when penalties exceed total points', () => {
    const score = calculateScore(0, 20, 5);
    expect(score).toBe(0);
  });
});