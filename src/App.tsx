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
	const { colorPrimary } = antdTheme.useToken().token

	return (
		<ConfigProvider theme={{ token: { colorPrimary: siteTheme || colorPrimary } }}>
			<ColorPicker showText onChangeComplete={(color) => changeSiteTheme(color.toHexString())} />

			<div className='app min-h-100vh' style={{ color: siteTheme }}>
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
			</div>
		</ConfigProvider>
	)
}
