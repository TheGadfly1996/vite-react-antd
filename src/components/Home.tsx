export default () => {
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
