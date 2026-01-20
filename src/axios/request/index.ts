import { notification } from 'antd'
import { useGlobalStore } from '@/store/global'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'

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
  // 建议只移除关键的认证信息，而不是 clear()
  localStorage.removeItem('token')
  // showLoginDialog() // 假设这个函数会处理路由跳转或弹窗
}

/**
 * 请求失败后的错误统一处理
 * @param status 状态码
 * @param msg 错误信息
 */
const handleError = (status: number, msg: string) => {
  // 根据项目实际情况，定义更详细的错误处理逻辑
  const errorMessages: { [key: number]: string } = {
    4001: '登录失效，请重新登录',
    4003: '没有权限访问',
    5000: '服务器内部错误',
  }

  if (errorMessages[status]) {
    notification.error({ message: errorMessages[status] || msg, duration: 2 })
  } else if (status >= 3000) {
    // 对其他业务错误码进行通用提示
    notification.error({ message: msg, duration: 2 })
  }

  // 特定错误码的特殊处理
  switch (status) {
    case 4001: // 例如 4001 代表 token 失效
      toLogin()
      break
    // 可以添加更多 case
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
      // 默认显示 loading
      if (requestConfig.isShowLoading !== false) {
        useGlobalStore.getState().changeLoadingStatus(true)
      }
      // 可以在这里统一添加 token
      // const token = localStorage.getItem('token');
      // if (token) {
      //   (requestConfig.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
      // }
      return requestConfig
    },
    (error) => {
      // 请求配置错误，直接关闭 loading
      useGlobalStore.getState().changeLoadingStatus(false)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  axiosInstance.interceptors.response.use(
    (response) => {
      // 响应成功，立即关闭 loading
      if (response.config.isShowLoading !== false) {
        useGlobalStore.getState().changeLoadingStatus(false)
      }

      const { data } = response
      // 业务成功状态码，直接返回数据
      if (data.code === 2000) {
        return data
      }

      // 如果配置了不拦截错误，则直接抛出，由业务代码自行处理
      if (response.config.isInterceptError === true) {
        return Promise.reject(data)
      }

      // 统一处理业务错误
      handleError(data.code, data.msg)
      return Promise.reject(data)
    },
    (error) => {
      // HTTP 错误，延迟关闭 loading 以优化体验
      setTimeout(() => {
        if (error.config.isShowLoading !== false) {
          useGlobalStore.getState().changeLoadingStatus(false)
        }
      }, 300)

      // 如果配置了不显示错误消息，则直接抛出
      if (error.config?.isShowErrorMessage === false) {
        return Promise.reject(error)
      }

      // 统一处理 HTTP 错误
      const message =
        error.response?.data?.msg || error.message || '请求发生错误'
      notification.error({ message, duration: 2 })

      return Promise.reject(error)
    }
  )

  return { request: axiosInstance.request, axiosInstance }
}

export default createAxiosInstance
