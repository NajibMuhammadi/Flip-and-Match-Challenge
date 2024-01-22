window.addEventListener('load', () => {
    document.querySelector('#newGame').addEventListener('click', validateForm);
});
function validateForm() {
    initGlobalObject();
    oGameData.nickNamePlayerOne = document.querySelector('#nick_1').value;
    oGameData.colorPlayerOne = document.querySelector('#color_1').value;
    oGameData.nickNamePlayerTwo = document.querySelector('#nick_2').value;
    oGameData.colorPlayerTwo = document.querySelector('#color_2').value;
    initGame();
}
function initGame() {
    document.querySelector('#form').classList.add('d-none');
    document.querySelector('#errorMsg').textContent = '';
    generateGameField();
    const tableRef = document.querySelector('#gameTable');
    tableRef.addEventListener('click', executeMove);
    generateStartingPlayer();
}
function generateStartingPlayer() {
    let playerName = '';
    const random = Math.random();
    if (random < 0.5) {
        oGameData.currentPlayer = 1;
        playerName = oGameData.nickNamePlayerOne;
    } else {
        oGameData.currentPlayer = 2;
        playerName = oGameData.nickNamePlayerTwo;
    }
    document.querySelector('#msg').textContent = 'Aktuell spelare är ' + playerName;
}
function executeMove(event) {
    if (event.target.tagName === 'TD') {
        if (event.target.firstChild.getAttribute('data-card-inplay')) {
            event.target.firstChild.classList.toggle('d-none');
            if (oGameData.currentMove === 1) {
                oGameData.flippedCard = event.target.firstChild;
                oGameData.currentMove = 2;
            } else {
                if (event.target.firstChild.getAttribute('data-card-id') === oGameData.flippedCard.getAttribute('data-card-id')) {
                    event.target.firstChild.setAttribute('data-card-inplay', false);
                    oGameData.flippedCard.setAttribute('data-card-inplay', false);
                    if (oGameData.currentPlayer === 1) {
                        oGameData.scorePlayerOne++;
                        event.target.firstChild.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerOne + ';');
                        oGameData.flippedCard.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerOne + ';');
                    } else {
                        oGameData.scorePlayerTwo++;
                        event.target.firstChild.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerTwo + ';');
                        oGameData.flippedCard.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerTwo + ';');
                    }
                    oGameData.remainingCards -= 2;
                    oGameData.currentMove = 1;
                } else {
                    setTimeout(() => {
                        event.target.firstChild.classList.toggle('d-none');
                        oGameData.flippedCard.classList.toggle('d-none');
                        changePlayer();
                    }, 1500);
                }
                const winner = checkForWinner();
                if (winner !== 0) {
                    gameOver(winner);
                }
            }
        }
    }
}
function gameOver(winner) {
    document.querySelector('#form').classList.remove('d-none');
    const tableRef = document.querySelector('#gameTable');
    tableRef.removeEventListener('click', executeMove);
    let winnerName = '';
    if (winner === 1) {
        winnerName = oGameData.nickNamePlayerOne;
    } else if (winner === 2) {
        winnerName = oGameData.nickNamePlayerTwo;
    } else if (winner === 3) {
        winnerName = 'Ingen';
    }
    document.querySelector('#msg').textContent = winnerName + ' har vunnit!';
}
function checkForWinner() {
    if (oGameData.remainingCards === 0) {
        if (oGameData.scorePlayerOne > oGameData.scorePlayerTwo) {
            return 1;
        } else if (oGameData.scorePlayerOne < oGameData.scorePlayerTwo) {
            return 2;
        } else {
            return 3;
        }
    } else {
        return 0;
    }
}
function changePlayer() {
    if (oGameData.currentPlayer === 1) {
        oGameData.currentPlayer = 2;
        document.querySelector('#msg').textContent = 'Aktuell spelare är ' + oGameData.nickNamePlayerTwo;
    } else {
        oGameData.currentPlayer = 1;
        document.querySelector('#msg').textContent = 'Aktuell spelare är ' + oGameData.nickNamePlayerOne;
    }
    oGameData.currentMove = 1;
}
function generateGameField() {
    const gameAreaRef = document.querySelector('#gameArea');
    gameAreaRef.innerHTML = '';
    gameAreaRef.classList.add('row', 'justify-content-center', 'mt-5');
    const tableRef = document.createElement('table');
    tableRef.id = 'gameTable';
    tableRef.classList.add('ml-0', 'mr-0');
    let deck = [];
    for (let i = 1; i < 9; i++) {
        for (let j = 0; j < 2; j++) {
            const card = {
                value: i,
                imageUrl: './images/' + i + '.jpg'
            }
            deck.push(card);
        }
    }
    deck = shuffleDeck(deck);
    for (let i = 0; i < 4; i++) {
        const rowRef = document.createElement('tr');
        for (let j = 0; j < 4; j++) {
            const cellRef = document.createElement('td');
            const imgRef = document.createElement('img');
            const card = deck.pop();
            cellRef.style = 'width: 100px; height: 160px; border: 1px solid darkgrey; font-size: 50px; text-align: center; background-color: #CCCCCC;';
            imgRef.src = card.imageUrl;
            imgRef.setAttribute('data-card-id', card.value);
            imgRef.setAttribute('data-card-inplay', true);
            imgRef.classList.add('w-100', 'd-none');
            cellRef.appendChild(imgRef);
            rowRef.appendChild(cellRef);
        }
        tableRef.appendChild(rowRef);
    }
    gameAreaRef.appendChild(tableRef);
}
function shuffleDeck(deck) {
    let i, j, temp;
    for (i = deck.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
}