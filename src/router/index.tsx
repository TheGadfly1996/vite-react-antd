import { createBrowserRouter, RouteObject, Navigate, RouterProvider } from 'react-router-dom'
import Home from '@/components/Home.tsx'
import ErrorPage from '../views/ErrorPage.tsx'
import { Layout } from '@/views/Layout/index.tsx'

const Unocss = lazy(() => import('../views/unocss/index.tsx'))
const Zustand = lazy(() => import('../views/zustand/index.tsx'))
const Parent = lazy(() => import('../views/props/Parent.tsx'))
const TicTacToe = lazy(() => import('@/views/Tic-Tac-Toe/Board.tsx'))
const Login = lazy(() => import('@/views/Login.tsx'))
const Alipay = lazy(() => import('@/views/Alipay/index.tsx'))

const routes: RouteObject[] = [
	{
		path: '*',
		element: <Navigate to={'/'} replace />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/',
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/home',
				element: <Home />,
			},
			{
				path: '/unocss',
				element: <Unocss />,
			},
			{
				path: '/zustand',
				element: <Zustand />,
			},
			{
				path: '/hooks-test',
				element: <Parent />,
			},
			{
				path: '/TicTacToe',
				element: <TicTacToe />,
			},
			{
				path: '/alipay',
				element: <Alipay />,
			},
		],
	},
]

const router = createBrowserRouter(routes)

export const Routes: React.FC = () => {
	return <RouterProvider router={router} />
}
