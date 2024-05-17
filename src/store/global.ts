import { create } from 'zustand'
import createSelectors from './selectors'
import { persist } from 'zustand/middleware'

interface SpinState {
	siteTheme: string
	isShowLoading: boolean
	siteLanguage: languageType
	changeLoadingStatus: (by: boolean) => void
	changeSiteTheme: (by: string) => void
	changeLanguage: (by: languageType) => void
}

export const useGlobalStore = createSelectors(
	create<SpinState>()(
		persist(
			(set) => ({
				isShowLoading: false,
				changeLoadingStatus: (isShowLoading) => set(() => ({ isShowLoading })),

				siteTheme: '',
				changeSiteTheme: (siteTheme) => set(() => ({ siteTheme })),

				siteLanguage: 'en-US',
				changeLanguage: (siteLanguage) => set(() => ({ siteLanguage })),
			}),
			{
				name: 'global-storage',
				partialize: (state) => ({
					siteTheme: state.siteTheme,
				}),
			},
		),
	),
)
