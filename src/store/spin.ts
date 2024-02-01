import { create } from 'zustand'
import createSelectors from './selectors'

interface SpinState {
	isShowLoading: boolean
	lastName: string
	changeLoadingStatus: (by: boolean) => void
	updateLastName: (by: string) => void
}

export const useSpinStore = createSelectors(
	create<SpinState>((set) => ({
		isShowLoading: false,
		lastName: 'zhang',
		changeLoadingStatus: (isShowLoading) => set(() => ({ isShowLoading: isShowLoading })),
		updateLastName: (lastName) => set(() => ({ lastName: lastName })),
	})),
)
