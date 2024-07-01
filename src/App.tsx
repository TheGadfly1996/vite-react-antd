import { ConfigProvider, theme as antdTheme } from 'antd'

import { useGlobalStore } from '@/store/global'
import { ANT_DESIGN_LOCALE } from '@/i18n/index'

import { Layout } from '@/views/Layout/index'

export default function App() {
	const { siteTheme, siteLanguage } = useGlobalStore()

	return (
		<ConfigProvider locale={ANT_DESIGN_LOCALE[siteLanguage]}>
			<div className='app min-h-100vh' style={{ color: siteTheme }}>
				<Layout></Layout>
			</div>
		</ConfigProvider>
	)
}
