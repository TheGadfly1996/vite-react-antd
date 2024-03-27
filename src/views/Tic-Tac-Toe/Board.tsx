import { Square } from '.'

export default function Board() {
	const [xIsNext, setXIsNext] = useState(true)
	const [squares, setSquares] = useState(Array(9).fill(null))

	//calculateWinner
	function calculateWinner(squares: string[]) {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		]
		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i]
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return squares[a]
			}
		}
		return null
	}

	// winner status
	const winner = calculateWinner(squares)
	let status: string
	if (winner) {
		status = 'Winner: ' + winner
	} else {
		status = 'Next player: ' + (xIsNext ? 'X' : 'O')
	}

	// handleClick
	function handleClick(i: number) {
		if (squares[i - 1] || calculateWinner(squares)) return
		const nextSquares = squares.slice()
		if (xIsNext) {
			nextSquares[i - 1] = 'X'
		} else {
			nextSquares[i - 1] = 'O'
		}
		setSquares(nextSquares)
		setXIsNext(!xIsNext)
	}

	return (
		<div className='m-20 app-container'>
			{status}
			<div className='board-row'>
				<Square value={squares[0]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(2)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(3)} />
			</div>
			<div className='board-row'>
				<Square value={squares[3]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(5)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(6)} />
			</div>
			<div className='board-row'>
				<Square value={squares[6]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(8)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(9)} />
			</div>
		</div>
	)
}
