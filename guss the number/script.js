
    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.getElementById('guessBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusBox = document.getElementById('statusBox');
    const scoreValue = document.getElementById('scoreValue');
    const triesValue = document.getElementById('triesValue');
    const bestValue = document.getElementById('bestValue');
    const historyList = document.getElementById('historyList');

    let secretNumber;
    let tries;
    let score;
    let gameOver;
    let bestScore = Number(localStorage.getItem('joyGuessBestScore')) || 0;
    let history = JSON.parse(localStorage.getItem('joyGuessHistory') || '[]');

    function initGame() {
      secretNumber = Math.floor(Math.random() * 100) + 1;
      tries = 0;
      score = 100;
      gameOver = false;
      guessInput.value = '';
      statusBox.textContent = 'Fresh round! Make a guess and chase that perfect score. ☀️';
      updateStats();
      renderHistory();
      guessInput.focus();
    }

    function updateStats() {
      scoreValue.textContent = score;
      triesValue.textContent = tries;
      bestValue.textContent = bestScore;
    }

    function saveHistory() {
      localStorage.setItem('joyGuessHistory', JSON.stringify(history));
      localStorage.setItem('joyGuessBestScore', String(bestScore));
    }

    function renderHistory() {
      if (!history.length) {
        historyList.innerHTML = `
          <div class="empty-state">
            No rounds finished yet. Win a round and your score history will appear here. 🌈
          </div>
        `;
        return;
      }

      historyList.innerHTML = history
        .slice()
        .reverse()
        .map((entry, index) => `
          <div class="history-item">
            <div class="history-top">
              <span>Round ${history.length - index}</span>
              <span class="history-score">${entry.score} pts</span>
            </div>
            <div class="history-meta">
              <span>🎯 Secret: ${entry.secret}</span>
              <span>🔁 Tries: ${entry.tries}</span>
              <span>🕒 ${entry.time}</span>
            </div>
          </div>
        `)
        .join('');
    }

    function finishRound() {
      gameOver = true;
      if (score > bestScore) bestScore = score;

      const time = new Date().toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      history.push({
        score,
        tries,
        secret: secretNumber,
        time
      });

      if (history.length > 12) history = history.slice(-12);
      saveHistory();
      updateStats();
      renderHistory();
    }

    function handleGuess() {
      if (gameOver) {
        statusBox.textContent = 'This round is done. Tap “New Round” to play again! 🎉';
        return;
      }

      const value = Number(guessInput.value);
      if (!value || value < 1 || value > 100) {
        statusBox.textContent = 'Please enter a number between 1 and 100. 😊';
        return;
      }

      tries += 1;

      if (value === secretNumber) {
        statusBox.textContent = `Amazing! ${value} is correct. You won with ${score} points! 🥳`;
        finishRound();
      } else {
        score = Math.max(0, score - 10);
        if (score === 0) {
          statusBox.textContent = `Out of points! The number was ${secretNumber}. Try a fresh round! 🍊`;
          gameOver = true;
          updateStats();
          return;
        }

        statusBox.textContent = value < secretNumber
          ? 'Too low — go a little higher! ⬆️'
          : 'Too high — bring it down a bit! ⬇️';
      }

      updateStats();
      guessInput.select();
    }

    guessBtn.addEventListener('click', handleGuess);
    resetBtn.addEventListener('click', initGame);
    guessInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleGuess();
    });

    bestValue.textContent = bestScore;
    renderHistory();
    initGame();