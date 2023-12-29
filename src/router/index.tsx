import { createBrowserRouter } from 'react-router-dom'
import Home from '@/components/Home.tsx'
import App from '../App.tsx'

export const routes = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/home',
		element: <Home />,
	},
])
