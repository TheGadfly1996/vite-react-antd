import { notification } from 'antd'
import { useGlobalStore } from '@/store/global'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import getBaseURL from '@/utils/getBaseUrl'
// 使用模块扩展为 AxiosRequestConfig 添加自定义属性
declare module 'axios' {
  interface AxiosRequestConfig {
    isShowLoading?: boolean // 是否显示 loading
    isInterceptError?: boolean // 是否由全局拦截处理错误
    isShowErrorMessage?: boolean // 是否显示错误通知
  }
}

/**
 * 跳转登录页
 * 清除用户认证信息，并携带当前页面路由以便登录后返回
 */
const toLogin = () => {
  localStorage.removeItem('token')
  const navigate = useNavigate()
  navigate('/login')
}

/**
 * 请求失败后的错误统一处理
 * @param status 状态码
 * @param msg 错误信息
 */
const handleError = (status: number, msg: string) => {
  const errorMessages: { [key: number]: string } = {
    4001: '登录失效，请重新登录',
    4003: '没有权限访问',
    5000: '服务器内部错误',
  }

  if (errorMessages[status]) {
    notification.error({ title: errorMessages[status] || msg, duration: 2 })
  } else if (status >= 3000) {
    notification.error({ title: msg, duration: 2 })
  }

  // 特定错误码的特殊处理
  switch (status) {
    case 4001:
      toLogin()
      break
    default:
      break
  }
}

/**
 * 创建并配置一个新的 Axios 实例
 * @param config Axios 的基础配置
 */
function createAxiosInstance(config: AxiosRequestConfig = {}): {
  request: AxiosInstance['request']
  axiosInstance: AxiosInstance
} {
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
      if (requestConfig.isShowLoading !== false) {
        useGlobalStore.getState().changeLoadingStatus(true)
      }
      // 添加 token 和 account 到请求头
      const token = localStorage.getItem('token')
      const account = localStorage.getItem('account')
      if (token && account) {
        Object.assign(requestConfig.headers, { Authorization: token, account })
      }

      const region = localStorage.getItem('region') || 'ZH'
      requestConfig.baseURL = getBaseURL(requestConfig.url, region)

      return requestConfig
    },
    (error) => {
      useGlobalStore.getState().changeLoadingStatus(false)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.config.isShowLoading !== false) {
        useGlobalStore.getState().changeLoadingStatus(false)
      }

      const { data } = response

      if (data.code === 2000) {
        return data
      }

      if (response.config.isInterceptError === true) {
        return Promise.reject(data)
      }

      // 统一处理业务错误
      handleError(data.code, data.msg)
      return Promise.reject(data)
    },
    (error) => {
      setTimeout(() => {
        if (error.config.isShowLoading !== false) {
          useGlobalStore.getState().changeLoadingStatus(false)
        }
      }, 300)

      if (error.config?.isShowErrorMessage === false) {
        return Promise.reject(error)
      }

      // 统一处理 HTTP 错误
      const message =
        error.response?.data?.msg || error.message || '请求发生错误'
      notification.error({ title: message, duration: 2 })

      return Promise.reject(error)
    }
  )

  return { request: axiosInstance.request, axiosInstance }
}

export default createAxiosInstance
