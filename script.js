import { generateSecretNumberUnique, generateSecretNumberWithRepeats, checkGuess, hasRepeats } from './game-logic.js';

let secretNumber = "";
let attempts = 0;
let history = []; // stores { guess, bulls, cows } for each attempt

const advancedToggle = document.getElementById("advancedToggle");
const historyToggle = document.getElementById("historyToggle");
const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const resultDisplay = document.getElementById("result");
const attemptsDisplay = document.getElementById("attemptsCount");
const historyPanel = document.getElementById("historyPanel");
const historyBody = document.getElementById("historyBody");

// Starts a new round: generates a secret number based on the current mode
function startNewGame() {
  const isAdvanced = advancedToggle.checked;
  secretNumber = isAdvanced
    ? generateSecretNumberUnique()
    : generateSecretNumberWithRepeats();
  attempts = 0;
  history = [];
  resultDisplay.textContent = "";
  attemptsDisplay.textContent = "";
  renderHistory();

  console.log(secretNumber); // for testing - remove later
}

// Rebuilds the history table from the history array
function renderHistory() {
  historyBody.innerHTML = "";
  history.forEach(function(entry) {
    const row = document.createElement("tr");

    const guessCell = document.createElement("td");
    guessCell.textContent = entry.guess;

    const resultCell = document.createElement("td");
    resultCell.textContent = `${entry.bulls}B / ${entry.cows}C`;

    row.appendChild(guessCell);
    row.appendChild(resultCell);
    historyBody.appendChild(row);
  });
}

advancedToggle.addEventListener("change", startNewGame);

// Toggles the visibility of the history panel
historyToggle.addEventListener("change", function() {
  historyPanel.style.display = historyToggle.checked ? "block" : "none";
});

startNewGame();

submitBtn.addEventListener("click", function() {
  const guess = guessInput.value;

  if (advancedToggle.checked && hasRepeats(guess)) {
    resultDisplay.textContent = "Advanced mode requires unique digits!";
    return;
  }

  attempts++;
  const { bulls, cows } = checkGuess(secretNumber, guess);

  history.push({ guess, bulls, cows });
  renderHistory();

  resultDisplay.textContent = `Bulls: ${bulls}, Cows: ${cows}`;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;

  if (bulls === 4) {
    resultDisplay.textContent = `🎉 You won in ${attempts} attempts!`;
  }
});