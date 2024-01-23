import { Outlet } from 'react-router-dom'
export default function App() {
	return (
		<div className='flex h-100% flex-col'>
			<header>Header</header>

			<main className='flex-1'>
				<Outlet />
			</main>
			<footer>Footer</footer>
		</div>
	)
}
