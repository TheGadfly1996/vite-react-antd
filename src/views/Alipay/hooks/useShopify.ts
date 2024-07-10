import { useState } from 'react'
import Client, { CheckoutLineItemInput, Product as ShopifyProduct, Checkout as ShopifyCheckout, Shop } from 'shopify-buy'

// Creates the client with Shopify-Buy and store info
const client = Client.buildClient({
	storefrontAccessToken: import.meta.env.VITE_SHOPIFY_TOKEN,
	domain: 'buzz.robosen.com',
	apiVersion: '2024-04',
})

export function useShopify() {
	const [isCartOpen, setIsCartOpen] = useState(false)
	const [cartCount, setCartCount] = useState(0)
	const [products, setProducts] = useState<ShopifyProduct[]>([])
	const [product, setProduct] = useState<ShopifyProduct | null>(null)
	const [featured, setFeatured] = useState<ShopifyProduct[]>([])
	const [checkoutStatus, setCheckoutStatus] = useState<ShopifyCheckout | null>(null)
	const [shop, setShop] = useState<Shop | null>(null)

	const fetchProducts = async () => {
		const products = await client.product.fetchAll()
		setProducts(products)
	}

	const fetchProduct = async (id: string) => {
		const product = await client.product.fetch(id)
		setProduct(product)
		return product
	}

	const createCheckout = async () => {
		const newCheckout = await client.checkout.create()
		console.log(newCheckout)

		setCheckoutStatus(newCheckout)
	}

	const createShop = async () => {
		const shopInfo = await client.shop.fetchInfo()
		setShop(shopInfo)
	}

	const addVariantToCart = async (checkoutId: string, lineItemsToAdd: CheckoutLineItemInput[]) => {
		const response = await client.checkout.addLineItems(checkoutId, lineItemsToAdd)
		setCheckoutStatus(response)
		return response
	}

	const updateQuantityInCart = async (lineItemId: string, quantity: number, checkoutId: string) => {
		const lineItemsToUpdate = [{ id: lineItemId, quantity }]
		const response = await client.checkout.updateLineItems(checkoutId, lineItemsToUpdate)
		setCheckoutStatus(response)
		return response
	}

	const removeLineItemInCart = async (checkoutId: string, lineItemId: string) => {
		await client.checkout.removeLineItems(checkoutId, [lineItemId])
		const updatedCheckout = await client.checkout.fetch(checkoutId)
		setCheckoutStatus(updatedCheckout)
	}

	const handleCartClose = () => {
		setIsCartOpen(false)
	}

	const handleCartOpen = () => {
		setIsCartOpen(true)
	}

	const handleSetCount = (count: number) => {
		setCartCount(count)
	}

	return {
		products,
		product,
		featured,
		isCartOpen,
		checkoutStatus,
		cartCount,
		shop,
		addVariantToCart,
		fetchProducts,
		fetchProduct,
		createCheckout,
		createShop,
		handleCartClose,
		handleCartOpen,
		updateQuantityInCart,
		removeLineItemInCart,
		handleSetCount,
	}
}
