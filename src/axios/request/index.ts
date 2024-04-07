import { notification } from 'antd'
// import { showLoginDialog } from '@/hooks/useLoginDialog'
import { useGlobalStore } from '@/store/global'
import type { AxiosRequestHeaders } from 'axios'
import axios from 'axios'

/**
 *  ! 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
	// showLoginDialog()
	localStorage.clear()
}
/**
 * ! 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param {String} message 请求失败的提示
 */
const handelError = async (status: number, msg: string) => {
	if (status >= 3000 && status <= 6000) {
		notification.error({ message: msg, duration: 2 })
	}
	switch (status) {
		case 4003:
			toLogin()
			break
		default:
			break
	}
}
/**
 * ! axios实例配置
 */
interface UseAxiosConfig {
	baseURL?: string
	timeout?: number
	headers?: AxiosRequestHeaders
}

function useAxios(config: UseAxiosConfig = {}) {
	const axiosInstance = axios.create({
		headers: {
			'Content-Type': 'application/json',
			...config.headers,
		},
		baseURL: 'https://test-robosenmall.robosen.cn',
		timeout: 1000 * 30,
	})

	// ! 请求拦截器
	axiosInstance.interceptors.request.use(
		(requestConfig) => {
			requestConfig.isShowLoading = requestConfig.isShowLoading ?? true
			if (requestConfig.isShowLoading) useGlobalStore.getState().changeLoadingStatus(true)
			requestConfig.headers['Accept-Language'] = 'en'
			// ! 调整参数位置
			if (requestConfig.payload) {
				if (requestConfig.method === 'delete' || requestConfig.method === 'get') {
					requestConfig.params = requestConfig.payload
				} else {
					requestConfig.data = requestConfig.payload
				}
			}
			return requestConfig
		},
		(error) => {
			setTimeout(() => {
				useGlobalStore.getState().changeLoadingStatus(false)
			}, 500)

			return Promise.reject(error)
		},
	)
	// ! 响应拦截器
	axiosInstance.interceptors.response.use(
		(response) => {
			setTimeout(() => {
				useGlobalStore.getState().changeLoadingStatus(false)
			}, 500)
			const { data } = response
			if (data.code !== 2000 && !response.config.isInterceptError) {
				handelError(data.code, data.msg)
				return Promise.reject(data.msg)
			}
			return data
		},
		(error) => {
			setTimeout(() => {
				useGlobalStore.getState().changeLoadingStatus(false)
			}, 500)

			/**
			 *  ! 控制错误信息弹窗的显示隐藏
			 */
			const showError = error.config?.isShowErrorMessage ?? true
			if (showError) {
				notification.error({ message: error.message, duration: 2 })
			}
			return Promise.reject(error)
		},
	)
	return { request: axiosInstance.request, axiosInstance }
}

export default useAxios
