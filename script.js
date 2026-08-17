import { checkGuess, hasRepeats } from './game-logic.js';
import { elements, renderOverlay, renderHistory, showMessage, togglePanel, selectNextEmptySlot } from './ui.js';
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
  const guess = elements.guessInput.value.replace(/\s/g, "");

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

  // Preserve hints logic for the next attempt
  const nextInputChars = [" ", " ", " ", " "];
  gameState.hintedPositions.forEach((pos) => {
    nextInputChars[pos] = gameState.secretNumber[pos];
  });
  
  elements.guessInput.value = nextInputChars.join("").trimEnd();
  renderOverlay(elements.guessInput.value, gameState.hintedPositions);
  elements.guessInput.focus();
  selectNextEmptySlot();
}

// Handles giving a hint inside the input field
function handleHint() {
  const hint = gameState.getHint();
  if (!hint) return;

  const currentChars = elements.guessInput.value.padEnd(4, " ").split("");
  currentChars[hint.position] = hint.digit;
  elements.guessInput.value = currentChars.join("");

  renderOverlay(elements.guessInput.value, gameState.hintedPositions);

  elements.guessInput.focus();
  selectNextEmptySlot();
}

// Custom typing handler to put digits in the next free slot
function handleDigitInput(key) {
  const currentChars = elements.guessInput.value.padEnd(4, " ").split("");
  
  // Find first empty space index that is not a hinted position
  const emptyIndex = currentChars.findIndex((char, i) => char === " " && !gameState.hintedPositions.includes(i));
  
  if (emptyIndex !== -1) {
    currentChars[emptyIndex] = key;
    elements.guessInput.value = currentChars.join("");
    renderOverlay(elements.guessInput.value, gameState.hintedPositions);
    selectNextEmptySlot();
  }
}

// Custom backspace handler to erase only user-typed digits, skipping hints
function handleBackspace() {
  const currentChars = elements.guessInput.value.padEnd(4, " ").split("");

  // Find the last user-entered character (ignoring spaces and hinted positions)
  for (let i = currentChars.length - 1; i >= 0; i--) {
    if (currentChars[i] !== " " && !gameState.hintedPositions.includes(i)) {
      currentChars[i] = " ";
      break;
    }
  }

  elements.guessInput.value = currentChars.join("").trimEnd();
  renderOverlay(elements.guessInput.value, gameState.hintedPositions);
  selectNextEmptySlot();
}

// --- Event Listeners ---

elements.guessInput.addEventListener("input", () => {
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
    return;
  }

  if (event.key === "Escape") {
    const nextInputChars = [" ", " ", " ", " "];
    gameState.hintedPositions.forEach((pos) => {
      nextInputChars[pos] = gameState.secretNumber[pos];
    });
    elements.guessInput.value = nextInputChars.join("").trimEnd();
    renderOverlay(elements.guessInput.value, gameState.hintedPositions);
    selectNextEmptySlot();
    return;
  }

  const isDigit = /^[0-9]$/.test(event.key);

  if (isDigit) {
    event.preventDefault();
    handleDigitInput(event.key);
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    handleBackspace();
    return;
  }

  // Allow only navigation keys like arrows and Tab
  const isAllowedNav = ["ArrowLeft", "ArrowRight", "Tab"].includes(event.key);
  if (!isAllowedNav) {
    event.preventDefault(); // Block letters, symbols, Delete, and other unwanted keys
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    startNewGame();
  }
});

// Exposes gameState ONLY when Playwright has pre-injected this flag before page load.
// A normal player cannot set this before script.js runs, since it must exist
// prior to this script executing - opening the console afterwards is too late.
if (window.__TEST_MODE__) {
  window.__testHooks = { gameState };
}

// Initialize game
startNewGame();