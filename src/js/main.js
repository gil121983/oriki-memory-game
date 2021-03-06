init();
let badPoints = 0;

function init() {
  sayHello()
}

function start(deck) {
  shuffle(deck);
  render(deck);

}

function render(cardsArray) {
  console.log(badPoints);
  var gridElement = document.querySelector('.grid');

  cardsArray.forEach(card => {
    const container = document.createElement('div')
    if (card.id === "empty-slot")
      container.className = "empty-slot";
    else {
      container.className = "flip-card hidden"

      const cardInner = document.createElement("div")
      cardInner.className = "flip-card-inner"
      cardInner.id = `card-inner${card.id}`
      cardInner.onclick = function () {
        let cardIdStr = `#card-inner${card.id}`
        onCardClick(cardIdStr, card, event)
      }

      const cardFront = document.createElement('div')
      cardFront.className = "flip-card-front card hidden"

      const cardBack = document.createElement('div');

      cardBack.className = 'flip-card-back';
      const img = document.createElement('img');
      img.src = card.src;
      img.setAttribute('style', 'width: 80px');

      cardBack.appendChild(img);
      cardInner.appendChild(cardBack)
      cardInner.appendChild(cardFront)
      container.appendChild(cardInner)
    }
    gridElement.appendChild(container);
  });

  let pickedCards = [];
  let gameStatus = "on"

  function onCardClick(cardIdStr, card, event) {
    if (event.target.classList.contains('hidden') && card.id !== "empty-slot" && gameStatus === "on") {
      if (pickedCards.length < 1) {
        event.target.classList.remove('hidden');
        pickedCards.push(card);
        flip(cardIdStr);
      } else {
        event.target.classList.remove('hidden');
        pickedCards.push(card);
        flip(cardIdStr);
        if (pickedCards[0].key !== pickedCards[1].key)
          flipBack();
        else
          removePair(pickedCards);
      }
    }
  };
  function flip(cardIdStr) {
    let element = document.querySelector(cardIdStr)
    if (true) {
      if (element.style.transform == "rotateY(180deg)") {
        element.style.transform = "rotateY(0deg)";
      }
      else {
        element.style.transform = "rotateY(180deg)";
      }
    }
  };
  function flipBack() {
    badPoints++;
    gameStatus = "off"
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'error',
      title: ''
    })
    setTimeout(() => {
      clear()
      render(cardsArray)
    }, 3000);
  };

  function removePair(cards) { //remove matched pair and calls checkForWinner 
    gameStatus = "off";
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
    })

    let cardAindex = cardsArray.findIndex(item =>
      item.id === cards[0].id)
    cardsArray.splice(cardAindex, 1, emptySlot);

    let cardBindex = cardsArray.findIndex(item =>
      item.id === cards[1].id)
    cardsArray.splice(cardBindex, 1, emptySlot);

    setTimeout(() => {
      clear()
      checkForWinner(cardsArray)
      render(cardsArray)
    }, 1000);
  };

  function checkForWinner(array) { //declare victory and calls sayHello
    let count = 0;

    array.forEach(i => {
      if (i.key)
        count += 1;
    })
    if (count === 0) {
      Swal.fire({
        title: 'Oriki wins!!!.',
        width: 600,
        padding: '3em',
        background: '#fff url(https://sweetalert2.github.io/images/trees.png)',
        backdrop: `
            rgba(0,0,123,0.4)
            url(https://sweetalert2.github.io/images/nyan-cat.gif)
            left top
            no-repeat
          `,
        onClose() {
          clear()
          sayHello()
        }
      })
    }



  };

  function clear() { //cleans the grid  
    while (gridElement.firstChild)
      gridElement.removeChild(gridElement.firstChild)

  };
};

function sayHello() {  //says welcome and calls setDifficulty
  Swal.fire({
    title: `Welcome to Ori's memory game`,
    confirmButtonText: 'New Game',
    width: 600,
    padding: '3em',
    background: '#fff url(https://sweetalert2.github.io/images/trees.png)',
    backdrop: `
    rgba(0,0,123,0.4)
    url(https://sweetalert2.github.io/images/nyan-cat.gif)
    left top
    no-repeat
    `,
    onClose() {
      setDifficulty()
    }
  })
};

function setDifficulty() { //sets difficulty and calls start with new deck
  Swal.fire({
    title: 'Set diffuclty',
    icon: 'question',
    background: '#fff url(https://sweetalert2.github.io/images/trees.png)',
    input: 'range',
    inputAttributes: {
      min: 4,
      max: 20,
      step: 2
    },
    inputValue: 10,
    onClose() {
      let diffuclty = Swal.getInput().value;
      const newDeck = [];
      for (let index = 0; index < diffuclty; index++) {
        newDeck.push(allCards[index])
      }
      start(newDeck)
    }
  })
};

function shuffle(array) { // shuffle array randomly
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

