import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { routes } from '@/router/index.tsx'
import '@/i18n/index.ts'

import './styles/index.scss'
import 'virtual:uno.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={routes} />
	</React.StrictMode>,
)
