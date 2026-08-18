// Generates a secret number where digits can repeat (Beginner mode)
export function generateSecretNumberWithRepeats(length = 4) {
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += Math.floor(Math.random() * 10);
  }
  return secret;
}

// Generates a secret number with unique digits only (Advanced mode)
export function generateSecretNumberUnique(length = 4) {
  const digits = ['0','1','2','3','4','5','6','7','8','9'];
  
  // Fisher-Yates Shuffle algorithm for unbiased randomness
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  return digits.slice(0, length).join('');
}

// Compares the guess against the secret number and counts bulls/cows
// Works correctly even if digits repeat in secret or guess
export function checkGuess(secret, guess) {
  let bulls = 0;
  let cows = 0;

  const secretDigits = secret.split('');
  const guessDigits = guess.split('');

  // First pass: count bulls and mark matched positions as used
  for (let i = 0; i < secretDigits.length; i++) {
    if (guessDigits[i] === secretDigits[i]) {
      bulls++;
      secretDigits[i] = null;
      guessDigits[i] = null;
    }
  }

  // Second pass: count cows from the remaining (unmatched) digits
  for (let i = 0; i < guessDigits.length; i++) {
    if (guessDigits[i] !== null) {
      const indexInSecret = secretDigits.indexOf(guessDigits[i]);
      if (indexInSecret !== -1) {
        cows++;
        secretDigits[indexInSecret] = null; // Mark as used so it's not counted twice
      }
    }
  }

  return { bulls, cows };
}

// Checks if a string has any repeated characters
export function hasRepeats(str) {
  return new Set(str).size !== str.length;
}

// Calculates the final score for a winning game
export function calculateScore(timeRemaining, attempts, hintsCount) {
  const base = 5000;
  const speedBonus = timeRemaining * 10;
  const attemptPenalty = Math.max(0, attempts - 1) * 150;
  const hintPenalty = hintsCount * 1000;

  const total = base + speedBonus - attemptPenalty - hintPenalty;
  return Math.max(0, total); // Ensures the score never drops below 0
}