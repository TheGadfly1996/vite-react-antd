import { create } from 'zustand'
import createSelectors from './selectors'

interface SpinState {
	isShowLoading: boolean
	changeLoadingStatus: (by: boolean) => void
}

export const useSpinStore = createSelectors(
	create<SpinState>((set) => ({
		isShowLoading: false,
		changeLoadingStatus: (isShowLoading) => set(() => ({ isShowLoading })),
	})),
)
