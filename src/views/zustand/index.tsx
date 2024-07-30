import { getMenus } from '@/axios/api/home'

const Banner = () => {
	const GetBanner = async () => {
		await getMenus()
	}
	return <Button onClick={GetBanner}>Get Banner</Button>
}

export default function Zustand() {
	return (
		<div>
			<Button href='/home'>home12311111</Button>
			<Banner />
		</div>
	)
}
