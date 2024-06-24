import 'axios'

declare module 'axios' {
	interface AxiosRequestConfig {
		isShowLoading?: boolean
		isShowErrorMessage?: boolean
		isInterceptError?: boolean
		payload?: any
	}
}
