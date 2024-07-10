import { createOrder } from '@/axios/api/home/index'
import { Products } from './Products'

export default function Alipay() {
	const handleAlipay = async () => {
		try {
			const { data } = await createOrder()
			console.log(data)

			window.location.href = data
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<>
			<Button onClick={handleAlipay}>发起阿里支付请求</Button>
			<Products />
		</>
	)
}
