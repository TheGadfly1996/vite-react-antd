import useAxios from '@/axios/request/index'

const { request } = useAxios()

export function login(data: { account: string; password: string }) {
  return request({
    url: '/account/admin/login',
    method: 'POST',
    data,
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
