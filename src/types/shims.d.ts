import type { AttributifyAttributes, AttributifyNames } from '@unocss/preset-attributify'
type Prefix = 'un-'
declare module 'react' {
	interface HTMLAttributes<T> extends Partial<Record<AttributifyNames<Prefix>, string>> {
		[key: string]: any
	}
}
