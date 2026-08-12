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
const helpToggle = document.getElementById("helpToggle");
const helpPanel = document.getElementById("helpPanel");

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
  guessInput.value = "";
  renderHistory();
  guessInput.focus();

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

// Submits the current guess and updates the game state
function submitGuess() {
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

  // Clear input and keep focus on it for the next guess
  guessInput.value = "";
  guessInput.focus();
}

advancedToggle.addEventListener("change", startNewGame);

historyToggle.addEventListener("change", function() {
  historyPanel.style.display = historyToggle.checked ? "block" : "none";
});

submitBtn.addEventListener("click", submitGuess);

// Keyboard shortcuts scoped to the input field
guessInput.addEventListener("keydown", function(event) {
  // Enter submits the guess
  if (event.key === "Enter") {
    submitBtn.click();
    return;
  }

  // Escape clears the input
  if (event.key === "Escape") {
    guessInput.value = "";
    return;
  }

  // Allow only digits plus control/navigation keys
  const isDigit = /^[0-9]$/.test(event.key);
  const isControlKey = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key);

  if (!isDigit && !isControlKey) {
    event.preventDefault();
  }
});

helpToggle.addEventListener("change", function() {
  helpPanel.style.display = helpToggle.checked ? "block" : "none";
});

// Global shortcut: Ctrl/Cmd + Enter restarts the game
document.addEventListener("keydown", function(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    startNewGame();
  }
});

startNewGame();