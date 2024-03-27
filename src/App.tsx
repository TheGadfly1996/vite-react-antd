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
				<header className='line-height-60 h-60 flex-sb-c'>
					<div className='i-mdi-home cursor-pointer' onClick={() => navigate('/home')}></div>
					<span className='m-auto'>Header</span>
				</header>
				<main className='flex-1'>
					<Outlet />
				</main>
				<footer>Footer</footer>
			</div>
		</>
	)
}
