const cardsContainer = document.querySelector(".cards");
const selectDifficulty = document.getElementById("difficulty");
const startButton = document.querySelector(".start");
const scoreElement = document.querySelector(".score");
const timerElement = document.querySelector(".timer");
const historyList = document.querySelector(".historyList");

const allCardValues = [
    "cat-cards/cat01.png",
    "cat-cards/cat02.png",
    "cat-cards/cat03.png",
    "cat-cards/cat04.png",
    "cat-cards/cat05.png",
    "cat-cards/cat06.png",
    "cat-cards/cat07.png",
    "cat-cards/cat08.png",
    "cat-cards/cat09.png",
    "cat-cards/cat10.png",
    "cat-cards/cat11.png",
    "cat-cards/cat12.png",
    "cat-cards/cat13.png",
    "cat-cards/cat14.png",
    "cat-cards/cat15.png",
    "cat-cards/cat16.png",
    "cat-cards/cat17.png",
    "cat-cards/cat18.png"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let timer = 0;
let timerInterval = null;
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;

startButton.addEventListener("click", startGame);

function startGame() {
    resetSelections();
    cardsContainer.innerHTML = "";
    stopTimer();
    resetGameStats();

    const difficulty = selectDifficulty.value;
    let pairCount = 0;
    let columns = 0;
    let rows = 0;

if (difficulty === "easy") {
    pairCount = 4;   // 8 cards
    columns = 4;
    rows = 2;
} else if (difficulty === "medium") {
    pairCount = 8;   // 16 cards
    columns = 4;
    rows = 4;
} else if (difficulty === "hard") {
    pairCount = 18;  // 36 cards
    columns = 6;
    rows = 6;
}

    totalPairs = pairCount;
    cardsContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    cardsContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const gameValues = createGameValues(pairCount);
    createCards(gameValues);
    startTimer();
}

function resetGameStats() {
    score = 0;
    timer = 0;
    matchedPairs = 0;
    moves = 0;
    updateScore();
    updateTimer();
}

function createGameValues(pairCount) {
    const shuffledBase = shuffleArray([...allCardValues]);
    const selectedValues = shuffledBase.slice(0, pairCount);
    const doubledValues = [...selectedValues, ...selectedValues];
    return shuffleArray(doubledValues);
}

function shuffleArray(array) {
    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
    }

    return newArray;
}

function createCards(values) {
    values.forEach((value) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = value;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${value}" alt="card front">
                </div>
                <div class="card-back">
                    <img src="cat-cards/back.png" alt="card back">
                </div>
            </div>
        `;

        card.addEventListener("click", () => flipCard(card));
        cardsContainer.appendChild(card);
    });
}

function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("matched")) return;
    if (card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;
    moves++;

    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        markAsMatched();
    } else {
        unflipCards();
    }
}

function markAsMatched() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;
    score += 10;
    updateScore();

    resetSelections();
    checkWin();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        score = Math.max(0, score - 1);
        updateScore();
        resetSelections();
    }, 900);
}

function resetSelections() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function updateScore() {
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function updateTimer() {
    if (timerElement) {
        timerElement.textContent = formatTime(timer);
    }
}

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function checkWin() {
    if (matchedPairs === totalPairs) {
        stopTimer();
        addScoreHistory();
        setTimeout(() => {
            alert(`You won!\nScore: ${score}\nTime: ${formatTime(timer)}\nMoves: ${moves}`);
        }, 300);
    }
}

function addScoreHistory() {
    if (!historyList) return;

    const emptyItem = historyList.querySelector("li");
    if (emptyItem && emptyItem.textContent.includes("No rounds played yet")) {
        emptyItem.remove();
    }

    const difficulty = selectDifficulty.value;
    const historyItem = document.createElement("li");
    historyItem.textContent = `${difficulty.toUpperCase()} - Score: ${score} | Time: ${formatTime(timer)} | Moves: ${moves}`;
    historyList.prepend(historyItem);
}