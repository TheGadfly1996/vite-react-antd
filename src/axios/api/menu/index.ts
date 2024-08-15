import useAxios from '@/axios/request/index'

const { request } = useAxios()

export function getMenus() {
	return request<[]>({
		url: '/menus',
		method: 'GET',
		isShowLoading: false,
	})
}
export function CreateMenus(data: { name: string; type: string; route: string; parent_id: string | null; icon: string; menu_order: number }) {
	return request<[]>({
		url: '/menus',
		method: 'POST',
		data,
	})
}
