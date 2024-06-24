import useAxios from '@/axios/request/index'

const { request } = useAxios()

export function getUser(payload: { name: string; description: string }) {
	return request({
		url: '/getUser',
		method: 'POST',
		payload,
	})
}
export function createOrder() {
	return request<string>({
		url: '/create_order',
		method: 'POST',
	})
}
