import 'axios'

declare module 'axios' {
	interface AxiosRequestConfig {
		isShowLoading?: boolean
		isShowErrorMessage?: boolean
		isInterceptError?: boolean
		payload?: any
	}
}
declare interface AxiosResponseType<T = any> {
	code: number
	data: T
	msg?: string
}
