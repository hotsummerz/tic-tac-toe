import { useState, useEffect } from 'react'

export default function Board() {
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameMode, setGameMode] = useState(null)
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [playerNamesSet, setPlayerNamesSet] = useState(false)

  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [winningLine, setWinningLine] = useState([])

  const result = winning(squares)
  const winner = result?.winner || null

  useEffect(() => {
    if (
      gameMode === 'ai' &&
      !xIsNext &&
      !winner &&
      squares.some(square => square === null)
    ) {
      const emptyIndices = squares
        .map((val, index) => (val === null ? index : null))
        .filter((val) => val !== null)

      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)]

      setTimeout(() => {
        const nextSquares = squares.slice()
        nextSquares[randomIndex] = 'O'
        setSquares(nextSquares)
        setXIsNext(true)
      }, 800)
    }
  }, [squares, xIsNext, gameMode, winner])

  let status = ''
  if (winner) {
    status =
      (winner === 'X' ? player1 || 'X' : gameMode === 'ai' ? 'AI' : player2 || 'O') + ' wins!'
  } else if (squares.every((square) => square !== null)) {
    status = 'Draw!'
  } else {
    status =
      (xIsNext ? player1 || 'X' : gameMode === 'ai' ? 'AI' : player2 || 'O') + "'s turn"
  }

  function handleClick(i) {
    if (squares[i] || winner) return
    if (gameMode === 'ai' && !xIsNext) return

    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? 'X' : 'O'
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  function resetBoard() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setWinningLine([])
  }

  function startModeSelection(mode) {
    setGameMode(mode);
    setIsGameStarted(true)
  }

  function handleNameSubmit(e) {
    e.preventDefault();
    if (
      (gameMode === 'pvp' && player1.trim() && player2.trim()) ||
      (gameMode === 'ai' && player1.trim())
    ) {
      setPlayerNamesSet(true)
    }
  }

  function Square({ value, SquareClick, isWinning  }) {
  return (
    <button className={`square ${isWinning ? 'highlight' : ''}`} onClick={SquareClick}>
      {value}
    </button>
  )
}

 useEffect(() => {
  if (result?.line) {
    setWinningLine(result.line)
  } else {
    setWinningLine([])
  }
  }, [squares, result])

  const showTitle = !isGameStarted

  return (
    <div>
      {showTitle && <h1 className="title">✨ TIC-TAC-TOE ✨</h1>}

      {!isGameStarted ? (
        <div className="menu">
          <div className="buttonColumn">
            <button className="menuButton" onClick={() => startModeSelection('pvp')}>
              👥 Player vs Player 👥
            </button>
            <button className="menuButton" onClick={() => startModeSelection('ai')}>
              👥 Player vs AI 🤖
            </button>
          </div>
        </div>
      ) : !playerNamesSet ? (
        <div className="menu">
          <h3 className="subtitle">
            Enter Player Name{gameMode === 'pvp' ? 's' : ''}
          </h3>

          <form onSubmit={handleNameSubmit} className="nameForm">
            <input
              className="nameInput"
              type="text"
              placeholder="Player 1 (X)"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              required
            />

            {gameMode === 'pvp' && (
              <input
                className="nameInput"
                type="text"
                placeholder="Player 2 (O)"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                required
              />
            )}

            <div className="buttonRow">
              <button className="menuButton" type="submit">
                Start
              </button>
              
              <button
                className="menuButton"
                type="button"
                onClick={() => {
                  setIsGameStarted(false)
                  setGameMode(null)
                  setPlayer1('')
                  setPlayer2('')
                }}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="gameContainer">
          <div className="status">
            {status}
          </div>

          <div className="board">
            <Square value = {squares[0]} SquareClick = {() => handleClick(0)} isWinning={winningLine.includes(0)}/>
            <Square value = {squares[1]} SquareClick = {() => handleClick(1)} isWinning={winningLine.includes(1)}/>
            <Square value = {squares[2]} SquareClick = {() => handleClick(2)} isWinning={winningLine.includes(2)}/>
            <Square value = {squares[3]} SquareClick = {() => handleClick(3)} isWinning={winningLine.includes(3)}/>
            <Square value = {squares[4]} SquareClick = {() => handleClick(4)} isWinning={winningLine.includes(4)}/>
            <Square value = {squares[5]} SquareClick = {() => handleClick(5)} isWinning={winningLine.includes(5)}/>
            <Square value = {squares[6]} SquareClick = {() => handleClick(6)} isWinning={winningLine.includes(6)}/>
            <Square value = {squares[7]} SquareClick = {() => handleClick(7)} isWinning={winningLine.includes(7)}/>
            <Square value = {squares[8]} SquareClick = {() => handleClick(8)} isWinning={winningLine.includes(8)}/>
          </div>

          <div className="buttonRow">
            <button className="menuButton" onClick={resetBoard}>
              Reset
            </button>
            <button
              className="menuButton"
              onClick={() => {
                setIsGameStarted(false)
                setGameMode(null)
                setPlayer1('')
                setPlayer2('')
                setPlayerNamesSet(false)
                resetBoard()
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function winning(squares) {
  const rules = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let [a, b, c] of rules) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }
    }
  }
  return null
}