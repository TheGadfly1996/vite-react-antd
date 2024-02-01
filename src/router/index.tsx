import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from '@/components/Home.tsx'
import App from '../App.tsx'
import ErrorPage from '../views/ErrorPage.tsx'
import Unocss from '../views/unocss/index.tsx'
import Zustand from '../views/zustand/index.tsx'
import Parent from '../views/props/parent.tsx'

export const routes = createBrowserRouter([
	{
		path: '*',
		element: <Navigate to={'/'} replace />,
	},
	{
		path: '/',
		element: <App />,
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
				path: '/props',
				element: <Parent />,
			},
		],
	},
])
