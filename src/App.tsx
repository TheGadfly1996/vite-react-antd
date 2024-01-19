import { Outlet } from 'react-router-dom'
import imgUrl from '@/assets/images/test-lossy.jpg'

export default function App() {
	return (
		<div>
			<header>
				<h1>Header</h1>
				<Button type='link' href='/home'>
					go home
				</Button>
			</header>

			<img src={imgUrl} alt='' />
			<div class='w-full flex items-center justify-center gap-x-4 text-4xl p-2 mt-4'>
				<div class='i-mdi-cow text-20 text-orange-400' />
				<div class='i-mdi-cow text-20 text-orange-400' />
			</div>
			<Outlet />
		</div>
	)
}
