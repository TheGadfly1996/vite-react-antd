export {}
declare global {
	type languageType = 'zh-CN' | 'en-US'
	interface AxiosResponseType<T = any> {
		code: number
		data: T
		msg?: string
	}
}
