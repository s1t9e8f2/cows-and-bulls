import { checkGuess, hasRepeats } from './game-logic.js';
import { elements, renderOverlay, renderHistory, showMessage, togglePanel } from './ui.js';
import { gameState } from './game-state.js';

// Starts or restarts a game round
function startNewGame() {
  gameState.reset(elements.advancedToggle.checked);
  
  elements.guessInput.value = "";
  showMessage("", "");
  renderHistory(gameState.history);
  renderOverlay(elements.guessInput.value, gameState.hintedPositions);
  elements.guessInput.focus();
}

// Submits the current guess and updates the game state
function submitGuess() {
  const guess = elements.guessInput.value;

  if (guess.length < 4) {
    showMessage("Please enter 4 digits!");
    return;
  }

  if (elements.advancedToggle.checked && hasRepeats(guess)) {
    showMessage("Advanced mode requires unique digits!");
    return;
  }

  gameState.attempts++;
  const { bulls, cows } = checkGuess(gameState.secretNumber, guess);

  gameState.history.push({ guess, bulls, cows });
  renderHistory(gameState.history);

  if (bulls === 4) {
    showMessage(`🎉 You won in ${gameState.attempts} attempts!`, `Attempts: ${gameState.attempts}`);
  } else {
    showMessage(`Bulls: ${bulls}, Cows: ${cows}`, `Attempts: ${gameState.attempts}`);
  }

  elements.guessInput.value = "";
  gameState.hintedPositions = [];
  renderOverlay(elements.guessInput.value, gameState.hintedPositions);
  elements.guessInput.focus();
}

// Handles giving a hint inside the input field
function handleHint() {
  const hint = gameState.getHint();
  if (!hint) return;

  const currentChars = elements.guessInput.value.padEnd(4, " ").split("");
  currentChars[hint.position] = hint.digit;

  elements.guessInput.value = currentChars.join("").trimEnd();
  renderOverlay(elements.guessInput.value, gameState.hintedPositions);
  elements.guessInput.focus();
}

// --- Event Listeners ---

elements.guessInput.addEventListener("input", () => {
  gameState.syncHintsWithInput(elements.guessInput.value);
  renderOverlay(elements.guessInput.value, gameState.hintedPositions);
});

elements.advancedToggle.addEventListener("change", startNewGame);
elements.historyToggle.addEventListener("change", () => togglePanel(elements.historyPanel, elements.historyToggle.checked));
elements.helpToggle.addEventListener("change", () => togglePanel(elements.helpPanel, elements.helpToggle.checked));

elements.submitBtn.addEventListener("click", submitGuess);
elements.restartBtn.addEventListener("click", startNewGame);
elements.hintBtn.addEventListener("click", handleHint);

elements.guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitGuess();
  } else if (event.key === "Escape") {
    elements.guessInput.value = "";
    gameState.hintedPositions = [];
    renderOverlay(elements.guessInput.value, gameState.hintedPositions);
  } else {
    const isDigit = /^[0-9]$/.test(event.key);
    const isControlKey = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key);
    if (!isDigit && !isControlKey) event.preventDefault();
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    startNewGame();
  }
});

// Initialize game
startNewGame();