import { describe, test, expect, beforeEach } from 'vitest';
import { gameState } from '../../game-state.js';
import { hasRepeats } from '../../game-logic.js';

describe('gameState.reset', () => {
  test('generates a 4-digit secret number', () => {
    gameState.reset(false);
    expect(gameState.secretNumber.length).toBe(4);
  });

  test('generates a secret with no repeated digits in advanced mode', () => {
    gameState.reset(true);
    expect(hasRepeats(gameState.secretNumber)).toBe(false);
  });

  test('resets attempts to zero', () => {
    gameState.attempts = 7; // simulate an in-progress game
    gameState.reset(false);
    expect(gameState.attempts).toBe(0);
  });

  test('resets history to an empty array', () => {
    gameState.history = [{ guess: '1234', bulls: 1, cows: 1 }];
    gameState.reset(false);
    expect(gameState.history).toEqual([]);
  });

  test('resets hintedPositions to an empty array', () => {
    gameState.hintedPositions = [0, 2];
    gameState.reset(false);
    expect(gameState.hintedPositions).toEqual([]);
  });
});

describe('gameState.getHint', () => {
  beforeEach(() => {
    gameState.reset(false);
    gameState.secretNumber = '1234';
  });

  test('returns the correct digit for a revealed position', () => {
    const hint = gameState.getHint();
    expect(gameState.secretNumber[hint.position]).toBe(hint.digit);
  });

  test('adds the revealed position to hintedPositions', () => {
    const hint = gameState.getHint();
    expect(gameState.hintedPositions).toContain(hint.position);
  });

  test('never reveals the same position twice', () => {
    const revealedPositions = [];
    for (let i = 0; i < 4; i++) {
      const hint = gameState.getHint();
      revealedPositions.push(hint.position);
    }
    // all four positions should be unique
    expect(new Set(revealedPositions).size).toBe(4);
  });

  test('returns null once all positions have been hinted', () => {
    for (let i = 0; i < 4; i++) {
      gameState.getHint();
    }
    expect(gameState.getHint()).toBeNull();
  });
});