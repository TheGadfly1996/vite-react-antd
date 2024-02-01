import { create } from 'zustand'
import createSelectors from './selectors'

interface BearState {
	count: number
	inc: (by: number) => void
}

export const useStore = createSelectors(
	create<BearState>((set) => ({
		count: 1,
		inc: () => set((state) => ({ count: state.count + 1 })),
	})),
)
