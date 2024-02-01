import { Outlet, useNavigate } from 'react-router-dom'
import Spin from '@/components/Spin'

export default function App() {
	const navigate = useNavigate()
	useEffect(() => {
		if (window.location.pathname === '/') navigate('/home')
	}, [navigate])

	return (
		<>
			<Spin />
			<div className='flex h-100% flex-col'>
				<header>Header</header>
				<main className='flex-1'>
					<Outlet />
				</main>
				<footer>Footer</footer>
			</div>
		</>
	)
}
