// DOM Element References
export const elements = {
  advancedToggle: document.getElementById("advancedToggle"),
  historyToggle: document.getElementById("historyToggle"),
  helpToggle: document.getElementById("helpToggle"),
  guessInput: document.getElementById("guessInput"),
  submitBtn: document.getElementById("submitBtn"),
  restartBtn: document.getElementById("restartBtn"),
  hintBtn: document.getElementById("hintBtn"),
  resultDisplay: document.getElementById("result"),
  attemptsDisplay: document.getElementById("attemptsCount"),
  historyPanel: document.getElementById("historyPanel"),
  historyBody: document.getElementById("historyBody"),
  helpPanel: document.getElementById("helpPanel"),
  inputOverlay: document.getElementById("inputOverlay"),
};

// Redraws the input overlay with numbers or placeholder question marks
export function renderOverlay(inputValue, hintedPositions) {
  const chars = inputValue.padEnd(4, " ").split("");
  elements.inputOverlay.innerHTML = "";

  chars.forEach((char, i) => {
    const span = document.createElement("span");

    if (char.trim() === "") {
      span.textContent = "?";
      span.classList.add("placeholder-digit");
    } else {
      span.textContent = char;
    }

    if (hintedPositions.includes(i)) {
      span.classList.add("hint-digit");
    }
    elements.inputOverlay.appendChild(span);
  });
}

// Rebuilds the history table from the history array
export function renderHistory(history) {
  elements.historyBody.innerHTML = "";
  history.forEach((entry) => {
    const row = document.createElement("tr");

    const guessCell = document.createElement("td");
    guessCell.textContent = entry.guess;

    const resultCell = document.createElement("td");
    resultCell.textContent = `${entry.bulls}B / ${entry.cows}C`;

    row.appendChild(guessCell);
    row.appendChild(resultCell);
    elements.historyBody.appendChild(row);
  });
}

// Displays game status messages
export function showMessage(resultText = "", attemptsText = "") {
  elements.resultDisplay.textContent = resultText;
  elements.attemptsDisplay.textContent = attemptsText;
}

// Toggles side panel visibility
export function togglePanel(panelElement, isVisible) {
  panelElement.style.display = isVisible ? "block" : "none";
}

// Selects the next empty (space) slot or non-hinted slot so typing overwrites in place
// Moves cursor to the next empty (space) slot without highlighting/selecting text
export function selectNextEmptySlot() {
  const value = elements.guessInput.value;
  const emptyIndex = value.indexOf(" ");

  if (emptyIndex === -1) {
    // No empty slots left - place cursor at the end
    elements.guessInput.setSelectionRange(value.length, value.length);
  } else {
    // Set cursor start and end to the same position (no selection highlight)
    elements.guessInput.setSelectionRange(emptyIndex, emptyIndex);
  }
}