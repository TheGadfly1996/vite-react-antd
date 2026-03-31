import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    isShowLoading?: boolean
    isShowErrorMessage?: boolean
    isInterceptError?: boolean
  }

  // 响应拦截器已解包 response.data.data → T，覆盖默认返回类型
  interface AxiosInstance {
    request<T = unknown>(config: AxiosRequestConfig): Promise<T>
    <T = unknown>(config: AxiosRequestConfig): Promise<T>
  }
}
