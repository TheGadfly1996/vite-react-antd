import { Image } from 'antd'
import { useShopify } from './hooks/useShopify'

export const Products = () => {
	const { products, fetchProducts, addVariantToCart, updateQuantityInCart, createCheckout, checkoutStatus } = useShopify()
	const [currentId, setCurrentId] = useState<string | null>()

	const handleCheckout = (id: string) => {
		createCheckout()
		setCurrentId(id)
		console.log(currentId)
	}
	const test = () => {
		console.log(currentId)
	}
	return (
		<>
			<Button onClick={fetchProducts}>获取所有商品</Button>
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
									<Button type='primary' className='mt-40 w-fit' onClick={() => handleCheckout(product.variants[i].id)}>
										add to cart
									</Button>
									<button onClick={test}> test</button>
								</li>
							)
						})}
				</ul>
			</div>
		</>
	)
}
