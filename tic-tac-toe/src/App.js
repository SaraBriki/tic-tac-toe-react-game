import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      // Task 4 from suggestions in tutorial
      className={`square ${isWinningSquare ? "colored-button" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i, row, col) {
    if (squares[i] || calculateWinner(squares)?.winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, row, col);
  }

  const winner = calculateWinner(squares)?.winner;
  const winningSquares = calculateWinner(squares)?.winningSquares;
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((square) => square)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {/* Task 2 from suggestions in tutorial */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="board-row">
          {Array.from({ length: 3 }).map((_, j) => (
            <Square
              key={j + i * 3}
              value={squares[j + i * 3]}
              onSquareClick={() => handleClick(j + i * 3, i, j)}
              isWinningSquare={winningSquares?.includes(j + i * 3)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  // Task 5 from suggestions in tutorial: changing `history` state variable to include move coordinates
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), moveCoords: [null, null] },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscOrder, setIsAscOrder] = useState(1);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove]?.squares;

  // To be called by Board with updated squares array when player makes a move
  function handlePlay(nextSquares, row, col) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, moveCoords: [row, col] },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Rendering Moves List:
  // Task 3 from suggestions in tutorial
  let orderedMoves = isAscOrder ? history : history.slice().reverse();
  let movesList = orderedMoves?.map((moveDetails, move) => {
    let moveNumber = isAscOrder ? move : history.length - move - 1;
    let description;
    description =
      moveNumber > 0
        ? "Go to move #" +
          moveNumber +
          ": (" +
          moveDetails.moveCoords[0] +
          ", " +
          moveDetails.moveCoords[1] +
          ")"
        : "Go to game start";
    return (
      <li key={moveNumber}>
        {/* Task 2 from suggestions in tutorial */}
        {moveNumber === currentMove ? (
          <strong>
            You are at move #{moveNumber}
            {moveNumber > 0 &&
              `: (${moveDetails.moveCoords[0]}, ${moveDetails.moveCoords[1]})`}
          </strong>
        ) : (
          <button onClick={() => jumpTo(moveNumber)}>{description}</button>
        )}
      </li>
    );
  });

  function toggleMovesOrder() {
    setIsAscOrder(!isAscOrder);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleMovesOrder}>Toggle order</button>
        <ol>{movesList}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: lines[i] };
    }
  }
  return null;
}