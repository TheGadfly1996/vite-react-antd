import createAxiosInstance from '@/axios/request/index'
const { request } = createAxiosInstance()

export function login(data: { account: string; password: string }) {
  return request<{
    admin_token: string
    admin_account: string
  }>({
    url: '/account/admin/login',
    method: 'POST',
    data,
    isInterceptError: false,
  })
}

export function getUserInfo(data: { admin_account: string }) {
  return request<{
    roles: string[]
    username: string
    roles_list: string[]
    avatar: string
  }>({
    url: '/account/admin/profile',
    method: 'GET',
    data,
  })
}
