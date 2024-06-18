export default function Home() {
	const navList = [
		{
			title: 'unocss',
			href: '/unocss',
		},
		{
			title: 'zustand',
			href: '/zustand',
			color: 'text-red',
		},
		{
			title: 'hooks-test',
			href: '/hooks-test',
			color: 'text-cyan',
		},
		{
			title: 'TicTacToe',
			href: '/TicTacToe',
			color: 'text-green',
		},
		{
			title: 'alipay',
			href: '/alipay',
			color: 'text-fuchsia',
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
