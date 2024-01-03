import { createBrowserRouter } from 'react-router-dom'
import Home from '@/components/Home.tsx'
import App from '../App.tsx'
import ErrorPage from '../views/ErrorPage.tsx'

export const routes = createBrowserRouter([
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
				path: '/about',
				element: <Home />,
			},
		],
	},
])
