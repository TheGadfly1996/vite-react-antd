interface MyButtonProps {
	count: number
	onClick: () => void
}

export function MyButton({ count, onClick }: MyButtonProps) {
	return <button onClick={onClick}>Clicked {count} times</button>
}
