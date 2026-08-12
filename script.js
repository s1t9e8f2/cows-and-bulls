import { generateSecretNumberUnique, generateSecretNumberWithRepeats, checkGuess, hasRepeats } from './game-logic.js';

let secretNumber = "";
let attempts = 0;

const advancedToggle = document.getElementById("advancedToggle");
const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const resultDisplay = document.getElementById("result");
const attemptsDisplay = document.getElementById("attemptsCount");

// Starts a new round: generates a secret number based on the current mode
function startNewGame() {
  const isAdvanced = advancedToggle.checked;
  secretNumber = isAdvanced
    ? generateSecretNumberUnique()
    : generateSecretNumberWithRepeats();
  attempts = 0;
  resultDisplay.textContent = "";
  attemptsDisplay.textContent = "";

  console.log(secretNumber); // for testing - remove later
}

advancedToggle.addEventListener("change", startNewGame);
startNewGame();

submitBtn.addEventListener("click", function() {
  const guess = guessInput.value;

  if (advancedToggle.checked && hasRepeats(guess)) {
    resultDisplay.textContent = "Advanced mode requires unique digits!";
    return;
  }

  attempts++;
  const { bulls, cows } = checkGuess(secretNumber, guess);
  resultDisplay.textContent = `Bulls: ${bulls}, Cows: ${cows}`;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;

  if (bulls === 4) {
    resultDisplay.textContent = `🎉 You won in ${attempts} attempts!`;
  }
});