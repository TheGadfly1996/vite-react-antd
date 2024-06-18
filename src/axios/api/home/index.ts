import useAxios from '@/axios/request/index'

const { request } = useAxios()

// 获取首页banner
export function getUser(payload: { name: string; description: string }) {
	return request({
		url: '/getUser',
		method: 'POST',
		payload,
	})
}
