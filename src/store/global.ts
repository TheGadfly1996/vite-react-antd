import { create } from 'zustand'
import createSelectors from './selectors'
import { persist } from 'zustand/middleware'

interface SpinState {
	siteTheme: string
	isShowLoading: boolean
	changeLoadingStatus: (by: boolean) => void
	changeSiteTheme: (by: string) => void
}

export const useGlobalStore = createSelectors(
	create<SpinState>()(
		persist(
			(set) => ({
				isShowLoading: false,
				changeLoadingStatus: (isShowLoading) => set(() => ({ isShowLoading })),

				siteTheme: '',
				changeSiteTheme: (siteTheme) => set(() => ({ siteTheme })),
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
