import type { MenuDataItem } from '@ant-design/pro-components'

export const routes = [
	{
		path: '/home',
		name: 'Home',
		icon: <div className='i-ant-design:home-outlined'></div>,
	},
	{
		path: '/admin',
		name: 'Profile',
		icon: <div className='i-ant-design:profile-outlined'></div>,
		routes: [
			{
				path: '/unocss',
				name: 'unocss',
			},
			{
				path: '/TicTacToe',
				name: 'Tic-Tac-Toe',
			},
			{
				path: '/hooks-test',
				name: 'hooks-test',
			},
			{
				path: '/zustand',
				name: 'zustand',
			},
			{
				path: '/alipay',
				name: 'alipay',
			},
		],
	},
]
