import type { MenuDataItem } from '@ant-design/pro-components'

export const defaultProps: MenuDataItem = {
	route: {
		path: '/',
		component: './Layout',
		routes: [
			{
				path: '/home',
				name: 'Home',
				icon: <div class='i-ant-design:home-outlined'></div>,
			},

			{
				path: '/admin',
				name: 'Profile',
				icon: <div class='i-ant-design:profile-outlined'></div>,
				key: 'Profile',
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
				],
			},
		],
	},
	location: {
		pathname: '/',
	},
	locale: 'zh-CN',
	menuProps: {
		openKeys: ['Profile'],
	},
	defaultCollapsed: false,
}
