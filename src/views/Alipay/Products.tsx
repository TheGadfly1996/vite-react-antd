import { Image } from 'antd'
import { useShopify } from './hooks/useShopify'

export const Products = () => {
	const { products, fetchProducts, addVariantToCart, createCheckout, checkoutStatus } = useShopify()

	useEffect(() => {
		fetchProducts()
	}, [])

	const handleCheckout = async (id: string) => {
		const newCheckout = await createCheckout()
		await addVariantToCart(newCheckout.id, [
			{
				variantId: id,
				quantity: 1,
			},
		])
		window.open(newCheckout.webUrl)
	}
	return (
		<>
			<div className='Product-wrapper'>
				<ul className='flex gap-60 mt-40 flex-wrap'>
					{products &&
						products.map((product, i) => {
							const image = product.images[0].src

							return (
								<li className='flex-c-c flex-wrap w-300 [&>*]:w-100%' key={product.id + i}>
									{image ? <Image className='rounded-10' width={300} src={image} alt={`${product.title} product shot`} /> : null}
									<div className='text-center mt-10'>
										<h4>{product.title}</h4>
										<h5>${product.variants[0].price.amount}</h5>
									</div>
									{/* {product.variants[i].id} */}
									<Button type='primary' className='mt-40 w-fit' onClick={() => handleCheckout(product.variants[0].id)}>
										购买
									</Button>
								</li>
							)
						})}
				</ul>
			</div>
		</>
	)
}
