import { generateSecretNumberUnique, generateSecretNumberWithRepeats } from './game-logic.js';

export const gameState = {
  secretNumber: "",
  attempts: 0,
  history: [],
  hintedPositions: [],

  // Resets state and generates a new secret number
  reset(isAdvanced) {
    this.secretNumber = isAdvanced
      ? generateSecretNumberUnique()
      : generateSecretNumberWithRepeats();
    this.attempts = 0;
    this.history = [];
    this.hintedPositions = [];
    
    //console.log("Secret Number:", this.secretNumber); // For testing purpose
  },

  // Generates a random hint for an unrevealed position
  getHint() {
    const remainingPositions = [];
    for (let i = 0; i < this.secretNumber.length; i++) {
      if (!this.hintedPositions.includes(i)) {
        remainingPositions.push(i);
      }
    }

    if (remainingPositions.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * remainingPositions.length);
    const position = remainingPositions[randomIndex];
    this.hintedPositions.push(position);

    return {
      position,
      digit: this.secretNumber[position],
    };
  }
};