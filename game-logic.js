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
  const shuffled = digits.sort(() => Math.random() - 0.5);
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += shuffled[i];
  }
  return secret;
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
        secretDigits[indexInSecret] = null; // mark as used so it's not counted twice
      }
    }
  }

  return { bulls, cows };
}

// Checks if a string has any repeated characters
export function hasRepeats(str) {
  return new Set(str).size !== str.length;
}