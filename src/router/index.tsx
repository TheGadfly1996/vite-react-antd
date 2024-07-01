import React, { Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from '@/components/Home.tsx'
import ErrorPage from '../views/ErrorPage.tsx'
import { Layout } from '@/views/Layout/index.tsx'

import type { RouteObject } from 'react-router-dom'

type CustomRouteObject = RouteObject & {
	permissions?: string[]
}

const Unocss = lazy(() => import('../views/unocss/index.tsx'))
const Zustand = lazy(() => import('../views/zustand/index.tsx'))
const Parent = lazy(() => import('../views/props/Parent.tsx'))
const TicTacToe = lazy(() => import('@/views/Tic-Tac-Toe/Board.tsx'))
const Login = lazy(() => import('@/views/Login.tsx'))
const Alipay = lazy(() => import('@/views/Alipay/index.tsx'))

// 假设当前用户的角色
const currentUserRole = 'admin'

// 组件映射
const componentsMap = {
	Layout,
	ErrorPage,
	Home,
	Unocss,
	Zustand,
	Parent,
	TicTacToe,
	Alipay,
}

interface RouteConfig {
	path: string
	element: string
	permissions?: string[]
	errorElement?: string
	children?: RouteConfig[] // 使用递归类型定义子路由
}
// 角色到路由权限的映射
const AsyncRoutes: RouteConfig[] = [
	{
		path: '/',
		element: 'Layout',
		errorElement: 'ErrorPage',
		children: [
			{
				path: '/home',
				element: 'Home',
				permissions: ['HOME'],
			},
			{
				path: '/unocss',
				element: 'Unocss',
				permissions: ['UNOCSS'],
			},
			{
				path: '/zustand',
				element: 'Zustand',
			},
			{
				path: '/hooks-test',
				element: 'Parent',
			},
			{
				path: '/TicTacToe',
				element: 'TicTacToe',
			},
			{
				path: '/alipay',
				element: 'Alipay',
			},
		],
	},
]
const generateRoutes = (routes: RouteConfig[]) => {
	const result = routes.map((item) => {
		const ElementComponent = componentsMap[item.element as keyof typeof componentsMap]
		return {
			...item,
			element: <ElementComponent />,
			children: item.children ? generateRoutes(item.children) : [],
		}
	})
	return result
}
console.log(generateRoutes(AsyncRoutes))

// 检查当前用户是否有访问特定路由的权限

const routes: CustomRouteObject[] = [
	{
		path: '*',
		element: <Navigate to={'/home'} replace />,
	},
	{
		path: '/login',
		element: <Login />,
	},
]

console.log([...routes, ...generateRoutes(AsyncRoutes)])

const router = createBrowserRouter([...routes, ...generateRoutes(AsyncRoutes)])

export const Routes: React.FC = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<RouterProvider router={router} />
		</Suspense>
	)
}
