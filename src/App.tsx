import { Outlet, useNavigate } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import Spin from '@/components/Spin'
import { useGlobalStore } from '@/store/global'

export default function App() {
	// navigate to /home if the current path is /
	const navigate = useNavigate()
	useEffect(() => {
		if (window.location.pathname === '/') navigate('/home')
	}, [navigate])

	// theme
	const { siteTheme, changeSiteTheme } = useGlobalStore()

	return (
		<ConfigProvider
			theme={{
				algorithm: siteTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
			}}
		>
			<Spin />

			<Switch onChange={(checked) => changeSiteTheme(checked ? 'dark' : 'light')} checkedChildren={<div className='i-ls-sun'></div>} unCheckedChildren={<div className='i-ls-moon'></div>} defaultChecked />

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
		</ConfigProvider>
	)
}
