import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'

export const ANT_DESIGN_LOCALE = {
	'zh-CN': zhCN,
	'en-US': enUS,
}

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		debug: true,
		lng: 'en-US',
		defaultNS: 'global',
		ns: ['global'],
		fallbackLng: 'en-US',
		interpolation: {
			escapeValue: false,
		},
		load: 'currentOnly',
		backend: {
			loadPath: (lng, ns) => `/locales/${lng}/${ns}.json`,
		},
		partialBundledLanguages: true,
	})

export default i18n
