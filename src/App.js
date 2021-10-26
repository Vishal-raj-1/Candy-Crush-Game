import { useState, useEffect } from 'react'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'
import gameMusicPlay from './music/gameMusic.mp3'
import dragCandyMusicPlay from './music/dragCandyMusic.mp3'
import matchCandyMusicPlay from './music/matchCandyMusic.mp3'
import './App.css'

let gameMusic = new Audio(gameMusicPlay);
let dragCandyMusic = new Audio(dragCandyMusicPlay);
let matchCandyMusic = new Audio(matchCandyMusicPlay);

const width = 8;
const candyColors = [
  blueCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
  greenCandy
];
const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDraged, setSquareBeingDraged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        columnOfFour.forEach(square => currentColorArrangement[square] = blank);
        setScoreDisplay((score) => score + 4);
        return true;
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        columnOfThree.forEach(square => currentColorArrangement[square] = blank);
        setScoreDisplay((score) => score + 3);
        return true;
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      if (i % width > 4)
        continue;

      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        rowOfFour.forEach(square => currentColorArrangement[square] = blank);
        setScoreDisplay((score) => score + 4);
        return true;
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      if (i % width > 5)
        continue;

      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        rowOfThree.forEach(square => currentColorArrangement[square] = blank);
        setScoreDisplay((score) => score + 3);
        return true;
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      if (i < width && currentColorArrangement[i] === blank) {
        currentColorArrangement[i] = candyColors[Math.floor(Math.random() * candyColors.length)];
      }

      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  }

  const createBoard = () => {
    let randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      randomColorArrangement[i] = candyColors[Math.floor(Math.random() * candyColors.length)];
    }
    setCurrentColorArrangement(randomColorArrangement);
  }

  const dragStart = (e) => {
    dragCandyMusic.play();
    setTimeout(() => dragCandyMusic.pause(), 100);
    setSquareBeingDraged(e.target);
  }

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  }

  const dragEnd = () => {
    const squareBeingDragedId = parseInt(squareBeingDraged.getAttribute('data-id'));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));

    currentColorArrangement[squareBeingDragedId] = squareBeingReplaced.getAttribute('src');
    currentColorArrangement[squareBeingReplacedId] = squareBeingDraged.getAttribute('src');
    const validMoves = [
      squareBeingDragedId - 1,
      squareBeingDragedId + 1,
      squareBeingDragedId - width,
      squareBeingDragedId + width
    ]
    const validMove = validMoves.includes(squareBeingReplacedId);

    if (squareBeingReplacedId && validMove &&
      (checkForColumnOfFour() || checkForRowOfFour() || checkForColumnOfThree() || checkForRowOfThree())) {
        matchCandyMusic.play();
        setTimeout(() => matchCandyMusic.pause(), 100);
      setSquareBeingDraged(null);
      setSquareBeingReplaced(null);
    }
    else {
      currentColorArrangement[squareBeingDragedId] = squareBeingDraged.getAttribute('src');
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
    }
    setCurrentColorArrangement([...currentColorArrangement]);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100)

    return () => clearInterval(timer);
  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement]);

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    gameMusic.play();
  }, gameMusic.pause());
  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) =>
            <img
              key={index}
              src={candyColor}
              data-id={index}
              draggable={true}
              onDragStart={dragStart}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
            />
        )}
      </div>
      <div className="score">
        <h1>{scoreDisplay}</h1>
        <h2>Score</h2>
      </div>
    </div>
  )
};

export default App;