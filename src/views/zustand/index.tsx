import { getUser } from '@/axios/api/home'

const Banner = () => {
	const GetBanner = async () => {
		await getUser()
	}
	return <Button onClick={GetBanner}>Get Banner</Button>
}

export default function Zustand() {
	return (
		<div>
			<Button href='/home'>home</Button>
			<Banner />
		</div>
	)
}
