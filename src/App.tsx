import { ConfigProvider, theme as antdTheme } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import Spin from '@/components/Spin'
import Header from '@/views/Layout/Header/LanguageMenu'

import { useTranslation } from 'react-i18next'
import { useGlobalStore } from '@/store/global'
import { ANT_DESIGN_LOCALE } from '@/i18n/index'

export default function App() {
	// navigate to /home if the current path is /
	const navigate = useNavigate()
	useEffect(() => {
		if (window.location.pathname === '/') navigate('/home')
	}, [navigate])

	// theme
	const { siteTheme, changeSiteTheme, siteLanguage } = useGlobalStore()
	const { colorPrimary } = antdTheme.useToken().token

	const { t } = useTranslation('global')

	return (
		<ConfigProvider theme={{ token: { colorPrimary: siteTheme || colorPrimary } }} locale={ANT_DESIGN_LOCALE[siteLanguage]}>
			<ColorPicker showText onChangeComplete={(color) => changeSiteTheme(color.toHexString())} />

			<div className='app min-h-100vh' style={{ color: siteTheme }}>
				<Spin />

				<div className='flex h-100% flex-col'>
					<header className='line-height-60 h-60 flex-sb-c'>
						<div className='i-mdi-home cursor-pointer' onClick={() => navigate('/home')}></div>
						<span className='m-auto'>{t('header')}</span>
					</header>
					<Header />
					<main className='flex-1'>
						<Outlet />
					</main>
					<footer>Footer</footer>
					<Pagination defaultCurrent={6} total={500} />
				</div>
			</div>
		</ConfigProvider>
	)
}
