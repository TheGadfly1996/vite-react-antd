export default function Home() {
	const navList = [
		{
			title: 'unocss',
			href: '/unocss',
			color: 'text-black',
		},
		{
			title: 'zustand',
			href: '/zustand',
			color: 'text-red',
		},
		{
			title: 'props',
			href: '/props',
			color: 'text-cyan',
		},
		{
			title: 'Tic-Tac-Toe',
			href: '/Tic-Tac-Toe',
			color: 'text-green',
		},
	]
	const listItem = navList.map((item) => (
		<li key={item.href} className={item.color}>
			<Button className={item.color} href={item.href}>
				{item.title}
			</Button>
		</li>
	))
	return (
		<>
			<ul className='flex flex-gap-10'>{listItem}</ul>
		</>
	)
}
