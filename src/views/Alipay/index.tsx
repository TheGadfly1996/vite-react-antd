import { getUser } from '@/axios/api/home/index'

export default function () {
	const [user, setUser] = useState(null)
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getUser({ name: 'jon', description: 'sss' })
				setUser(userData)
			} catch (err) {
				console.log(err)
			}
		}

		fetchUser()
	}, [])
	return <div>{user}</div>
}
