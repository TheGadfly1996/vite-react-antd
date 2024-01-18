import { Outlet } from 'react-router-dom'

export default function App() {
	return (
		<div>
			<header>
				<h1>Header</h1>
				<Button type='link' href='/home'>
					go home
				</Button>
			</header>
			<Outlet />
		</div>
	)
}
