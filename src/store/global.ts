import { create } from 'zustand'
import createSelectors from './selectors'
import { persist } from 'zustand/middleware'

export type ThemeType = 'dark' | 'light' | null

interface SpinState {
	siteTheme: ThemeType
	isShowLoading: boolean
	changeLoadingStatus: (by: boolean) => void
	changeSiteTheme: (by: ThemeType) => void
}

export const useGlobalStore = createSelectors(
	create<SpinState>()(
		persist(
			(set) => ({
				isShowLoading: false,
				changeLoadingStatus: (isShowLoading) => set(() => ({ isShowLoading })),

				siteTheme: 'light',
				changeSiteTheme: (siteTheme) => set(() => ({ siteTheme })),
			}),
			{
				name: 'global-storage',
				partialize: (state) => ({
					globalTheme: state.siteTheme,
				}),
			},
		),
	),
)
