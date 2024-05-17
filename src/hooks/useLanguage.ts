import { useTranslation } from 'react-i18next'
import { useGlobalStore } from '@/store/global'

export const useLanguage = () => {
	const { i18n } = useTranslation()
	const { changeLanguage } = useGlobalStore()

	const handleChangeLanguage = useCallback(
		(locale: languageType) => {
			i18n.changeLanguage(locale)
			changeLanguage(locale)
		},
		[i18n, changeLanguage],
	)

	return useMemo(
		() => ({
			language: i18n.language,
			setLanguage: handleChangeLanguage,
		}),

		[i18n.language, handleChangeLanguage],
	)
}
