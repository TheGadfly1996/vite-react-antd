import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes } from '@/router/index.tsx'
import '@/i18n/index.ts'

import './styles/index.scss'
import 'virtual:uno.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Routes />
	</React.StrictMode>,
)
