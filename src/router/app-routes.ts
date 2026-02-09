import { AuthGuard } from '@/components/AuthGuard'
import { Layout } from '@/views/Layout/index.tsx'
import Login from '@/views/Login.tsx'
import NotFound from '@/views/NotFound.tsx'
import React from 'react'
import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import { CloudRouter } from './cloud-routes'

const CommonRoutes: RouteObject[] = [
  {
    path: '/login',
    element: React.createElement(Login),
  },
  {
    path: '/',
    element: React.createElement(AuthGuard, null, React.createElement(Layout)),
    errorElement: 'ErrorPage',
    children: [...CloudRouter],
  },
  {
    path: '*',
    element: React.createElement(NotFound),
  },
]

export const AppRouter = createBrowserRouter([...CommonRoutes])
