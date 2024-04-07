import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from '@/components/Home.tsx'
import App from '../App.tsx'
import ErrorPage from '../views/ErrorPage.tsx'
import Unocss from '../views/unocss/index.tsx'
import Zustand from '../views/zustand/index.tsx'
import Parent from '../views/props/Parent.tsx'
import TicTacToe from '@/views/Tic-Tac-Toe/Board.tsx'
import Login from '@/views/Login.tsx'

export const routes = createBrowserRouter([
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
			{
				path: '/Tic-Tac-Toe',
				element: <TicTacToe />,
			},
		],
	},
])
