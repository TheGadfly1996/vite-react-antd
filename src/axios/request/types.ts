import type { AxiosRequestConfig } from 'axios'

// 添加自定义参数
interface customConfig extends AxiosRequestConfig {
	showLoading?: boolean
	payload?: object
	errorToIntercept?: boolean
}

// 拦截器类型
export interface requestInterceptors {
	// !请求拦截器
	requestInterceptor?: (config: customConfig) => customConfig
	requestInterceptorCatch?: (error: any) => any
	// !响应拦截器
	responseInterceptor?: <T>(res: T) => T
	responseInterceptorCatch?: (error: any) => any
}
// ! 自定义请求类型
export interface customRequestConfig extends requestInterceptors, customConfig {
	customInterceptors?: requestInterceptors
}
