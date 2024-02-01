import useAxios from '@/axios/request/index'
import type { BannerResponseData } from './type'

const { request } = useAxios()

// 获取首页banner
export function getBanner() {
	return request<Array<BannerResponseData>>({
		url: '/mall_hub/hub/v2/home/banner',
		method: 'GET',
	})
}
