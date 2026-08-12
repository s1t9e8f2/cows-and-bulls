function generateSecretNumber(length = 4) {
  const digits = ['0','1','2','3','4','5','6','7','8','9'];
  const shuffled = digits.sort(() => Math.random() - 0.5);

  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += shuffled[i];
  }

  return secret;
}

function checkGuess(secret, guess) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < secret.length; i++) {
    if (guess[i] === secret[i]) {
      bulls++;
    } else if (secret.includes(guess[i])) {
      cows++;
    }
  }

  return { bulls, cows };
}

const secretNumber = generateSecretNumber();
let attempts = 0;

const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const resultDisplay = document.getElementById("result");
const attemptsDisplay = document.getElementById("attemptsCount");

submitBtn.addEventListener("click", function() {
  const guess = guessInput.value;
  attempts++;

  const { bulls, cows } = checkGuess(secretNumber, guess);

  resultDisplay.textContent = `Bulls: ${bulls}, Cows: ${cows}`;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;

  if (bulls === 4) {
    resultDisplay.textContent = `🎉 You won in ${attempts} attempts!`;
  }
});