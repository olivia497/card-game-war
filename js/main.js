let deckId = ''; 
let playerOnePile = [];
let playerTwoPile = [];

//fetch is running on page load
fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data);
        deckId = data.deck_id;
      })
      .catch(err => {
          console.log(`error ${err}`)
      });

document.getElementById('drawCards').addEventListener('click', drawTwo)
document.getElementById('fight').addEventListener('click', timeForWar)
document.getElementById('restartGame').addEventListener('click', restartGame)


function drawTwo(){
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      showRestartGameButton()

      // Check if not enough cards remain
      if (data.remaining < 2 || !data.success) {
        document.querySelector('h3').innerText = 'Game Over! No more cards.';
        document.getElementById('drawCards').disabled = true;
        declareFinalWinner();
        return;
      }

      const card1 = data.cards[0];
      const card2 = data.cards[1];

      document.getElementById('playerOne').src = card1.image;
      document.getElementById('playerTwo').src = card2.image;

      let playerOneVal = convertToNum(card1.value);
      let playerTwoVal = convertToNum(card2.value);

      if(playerOneVal > playerTwoVal){
        document.querySelector('h3').innerText = 'Player 1 wins!';
        playerOnePile.push(card1, card2);
      }else if(playerOneVal < playerTwoVal){
        document.querySelector('h3').innerText = 'Player 2 wins!';
        playerTwoPile.push(card1, card2);
      }else{
        document.querySelector('h3').innerText = 'War!';
        showFightButton();
      }

      updateCardCounts();
    })
    .catch(err => {
      console.log(`error ${err}`);
    });
}

//helper function converting the cards that have name values into a number
function convertToNum(val){
  if(val === "ACE"){
    return 14
  }else if(val === "KING"){
    return 13
  }else if(val === "QUEEN"){
    return 12
  }else if(val === "JACK"){
    return 11
  }else{
    return Number(val)
  }
}

//restarting the game
function restartGame(){
  location.replace(location.href);
}

function showRestartGameButton(){
  const restartGame = document.getElementById('restartGame')
  restartGame.style.display = 'block';
}

//war activated
function showFightButton(){
  const fightButton = document.querySelector('.hidden-fight-button')
  const drawCardsButton = document.getElementById('drawCards')
  fightButton.style.display = 'block';
  drawCardsButton.style.display = 'none';
}

function timeForWar(){
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=8`

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if (data.remaining < 8 || data.cards.length < 8 || !data.success) {
        document.querySelector('h3').innerText = 'Game Over! Not enough cards for war.';
        document.getElementById('drawCards').disabled = true;
        hideFightButton();
        declareFinalWinner();
        return;
      }

      const warCards = data.cards
      const card1 = warCards[3]
      const card2 = warCards[7]

      document.getElementById('playerOne').src = card1.image
      document.getElementById('playerTwo').src = card2.image

      let playerOneVal = convertToNum(card1.value)
      let playerTwoVal = convertToNum(card2.value)

      if(playerOneVal > playerTwoVal){
        document.querySelector('h3').innerText = 'Player 1 wins war!'
        playerOnePile.push(...warCards)
        hideFightButton()
      }else if(playerOneVal < playerTwoVal){
        document.querySelector('h3').innerText = 'Player 2 wins war!'
        playerTwoPile.push(...warCards)
        hideFightButton()
      } else {
        document.querySelector('h3').innerText = 'Another war! (Nested war not implemented)'
      }

      updateCardCounts()
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

function hideFightButton(){
  const fightButton = document.querySelector('.hidden-fight-button')
  const drawCardsButton = document.getElementById('drawCards')
  fightButton.style.display = 'none';
  drawCardsButton.style.display = 'block';
}

//update card count
function updateCardCounts(){
  document.getElementById('playerOneCount').innerText = `Player 1: ${playerOnePile.length} cards`
  document.getElementById('playerTwoCount').innerText = `Player 2: ${playerTwoPile.length} cards`
};

//declare final winner
function declareFinalWinner(){
  const resultText = document.querySelector('h3')
  if (playerOnePile.length > playerTwoPile.length) {
    resultText.innerText += '\n Player 1 has the most cards and wins the game!'
  } else if (playerTwoPile.length > playerOnePile.length) {
    resultText.innerText += '\n Player 2 has the most cards and wins the game!'
  } else {
    resultText.innerText += '\n It\'s a tie!'
  }
}