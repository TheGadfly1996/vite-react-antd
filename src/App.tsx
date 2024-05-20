import { ConfigProvider, theme as antdTheme } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useGlobalStore } from '@/store/global'
import { ANT_DESIGN_LOCALE } from '@/i18n/index'

import { Layout } from '@/views/Layout/index'

export default function App() {
	// navigate to /home if the current path is /
	const navigate = useNavigate()
	useEffect(() => {
		if (window.location.pathname === '/') navigate('/home')
	}, [navigate])

	// theme
	const { siteTheme, siteLanguage } = useGlobalStore()

	return (
		<ConfigProvider locale={ANT_DESIGN_LOCALE[siteLanguage]}>
			<div className='app min-h-100vh' style={{ color: siteTheme }}>
				<Layout></Layout>
			</div>
		</ConfigProvider>
	)
}
