import { useGlobalStore } from '@/store/global'
import getBaseURL from '@/utils/getBaseUrl'
import { message } from 'antd'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
/**
 * 跳转登录页
 * 清除用户认证信息，并携带当前页面路由以便登录后返回
 */
const toLogin = () => {
  localStorage.removeItem('token')
  const current = window.location.pathname
  window.location.href = `/login?redirect=${encodeURIComponent(current)}`
}

/**
 * 业务错误处理（后端自定义 code，HTTP 状态码为 200）
 */
const handleBizError = (code: number, msg: string) => {
  const bizErrorMessages: Record<number, string> = {
    4001: '登录失效，请重新登录',
    4003: '没有权限访问',
    5000: '服务器内部错误',
  }

  message.error(bizErrorMessages[code] || msg)

  if (code === 4001) {
    toLogin()
  }
}

/**
 * HTTP 状态码错误处理
 */
const handleHttpError = (status: number) => {
  const httpErrorMessages: Record<number, string> = {
    404: '请求的资源不存在',
    405: '请求方法不被允许',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务暂时不可用',
    504: '网关超时',
  }

  message.error(httpErrorMessages[status] ?? `请求失败 (${status})`)

  if (status === 401) {
    toLogin()
  }
}

/** loading 最小显示时长（ms），避免快速请求导致闪烁 */
const MIN_LOADING_DURATION = 300

let activeRequests = 0
let loadingStartTime = 0

const showLoading = () => {
  if (activeRequests === 0) {
    loadingStartTime = Date.now()
    useGlobalStore.getState().changeLoadingStatus(true)
  }
  activeRequests++
}

const hideLoading = () => {
  activeRequests = Math.max(0, activeRequests - 1)
  if (activeRequests === 0) {
    const elapsed = Date.now() - loadingStartTime
    const delay = Math.max(0, MIN_LOADING_DURATION - elapsed)
    setTimeout(() => {
      if (activeRequests === 0) {
        useGlobalStore.getState().changeLoadingStatus(false)
      }
    }, delay)
  }
}

/**
 * 创建并配置一个新的 Axios 实例
 * @param config Axios 的基础配置
 */
function createAxiosInstance(
  config: AxiosRequestConfig = {
    isInterceptError: true,
    isShowErrorMessage: true,
    isShowLoading: true,
  }
) {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    timeout: 1000 * 30,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  })

  // 请求拦截器
  axiosInstance.interceptors.request.use(
    (requestConfig) => {
      if (requestConfig.isShowLoading) {
        showLoading()
      }
      // 添加 token 和 account 到请求头
      const token = localStorage.getItem('token')
      const account = localStorage.getItem('account')
      if (token && account) {
        Object.assign(requestConfig.headers, { Authorization: token, account })
      }

      const region = (localStorage.getItem('region') || 'ZH') as 'ZH' | 'EN' | 'EU'
      requestConfig.baseURL = getBaseURL(requestConfig.url, region)

      return requestConfig
    },
    (error) => {
      hideLoading()
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.config.isShowLoading) {
        hideLoading()
      }

      const { data } = response

      if (data.code === 2000) {
        return data.data
      }

      if (!response.config.isInterceptError) {
        return Promise.reject(data)
      }

      handleBizError(data.code, data.msg)
      return Promise.reject(data)
    },
    (error) => {
      if (error.config?.isShowLoading) {
        hideLoading()
      }

      const status = error.response?.status
      if (status) {
        handleHttpError(status)
      } else {
        // 无响应：网络断开、跨域、请求取消等
        message.error(error.message || '网络连接异常，请检查网络')
      }

      return Promise.reject(error)
    }
  )

  const request = <T = unknown>(config: AxiosRequestConfig): Promise<T> => axiosInstance(config)

  return { request, axiosInstance }
}

export default createAxiosInstance
