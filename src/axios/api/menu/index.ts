import useAxios from '@/axios/request/index'

const { request } = useAxios()

export function getMenus() {
	return request<[]>({
		url: '/menus',
		method: 'GET',
	})
}
