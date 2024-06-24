import { createOrder } from '@/axios/api/home/index'

export default function () {
	const handleCreate = async () => {
		try {
			const { data } = await createOrder()
			console.log(data)

			window.location.href = data
		} catch (err) {
			console.log(err)
		}
	}
	// useEffect(() => {
	// 	handleCreate()
	// }, [])
	return <Button onClick={handleCreate}>发起支付请求</Button>
}
