import { checkGuess, hasRepeats, calculateScore } from './game-logic.js';
import { elements, renderOverlay, renderHistory, showMessage, togglePanel, selectNextEmptySlot } from './ui.js';
import { gameState } from './game-state.js';

// --- Timer State ---
const GAME_TIME_LIMIT = 240; // 240 seconds
let timerInterval = null;
let timeRemaining = GAME_TIME_LIMIT;
let lastResultMessage = "";

function updateTimerDisplay() {
  const timerText = `⏱️ ${timeRemaining}s`;
  const displayMessage = lastResultMessage ? `${lastResultMessage} | ${timerText}` : timerText;
  showMessage(displayMessage, gameState.attempts > 0 ? `Attempts: ${gameState.attempts}` : "");
}

function startTimer() {
  stopTimer();
  timeRemaining = GAME_TIME_LIMIT;
  lastResultMessage = "";
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeRemaining--;

    if (timeRemaining <= 0) {
      stopTimer();
      handleTimeOut();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function handleTimeOut() {
  showMessage("⏰ Time is up! You lost this round.", "");
  if (elements.guessInput) elements.guessInput.disabled = true;
  if (elements.submitBtn) elements.submitBtn.disabled = true;
}

// Starts or restarts a game round
function startNewGame() {
  gameState.reset(elements.advancedToggle.checked);
  
  if (elements.guessInput) elements.guessInput.disabled = false;
  if (elements.submitBtn) elements.submitBtn.disabled = false;

  elements.guessInput.value = "";
  renderHistory(gameState.history);
  renderOverlay(elements.guessInput.value, gameState.hintedPositions);
  
  startTimer();

  elements.guessInput.focus();
}

// Submits the current guess and updates the game state
function submitGuess() {
  if (timeRemaining <= 0) return;

  const guess = elements.guessInput.value.replace(/\s/g, "");

  if (guess.length < 4) {
    lastResultMessage = "Please enter 4 digits!";
    updateTimerDisplay();
    return;
  }

  if (elements.advancedToggle.checked && hasRepeats(guess)) {
    lastResultMessage = "Advanced mode requires unique digits!";
    updateTimerDisplay();
    return;
  }

  gameState.attempts++;
  const { bulls, cows } = checkGuess(gameState.secretNumber, guess);

  gameState.history.push({ guess, bulls, cows });
  renderHistory(gameState.history);

  if (bulls === 4) {
    stopTimer();
    const timeTaken = GAME_TIME_LIMIT - timeRemaining;
    const score = calculateScore(timeRemaining, gameState.attempts, gameState.hintedPositions.length);
    
    showMessage(
      `🎉 You won in ${gameState.attempts} attempts for ${timeTaken} seconds! Score: ${score.toLocaleString()} pts`, 
      `Attempts: ${gameState.attempts}`
    );
  } else {
    lastResultMessage = `Bulls: ${bulls}, Cows: ${cows}`;
    updateTimerDisplay();
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
  if (timeRemaining <= 0) return;

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
  if (timeRemaining <= 0) return;

  const currentChars = elements.guessInput.value.padEnd(4, " ").split("");
  
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
  if (timeRemaining <= 0) return;

  const currentChars = elements.guessInput.value.padEnd(4, " ").split("");

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
  if (timeRemaining <= 0) return;

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

  const isAllowedNav = ["ArrowLeft", "ArrowRight", "Tab"].includes(event.key);
  if (!isAllowedNav) {
    event.preventDefault();
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    startNewGame();
  }
});

if (window.__TEST_MODE__) {
  window.__testHooks = { gameState };
}

// Initialize game
startNewGame();