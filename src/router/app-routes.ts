import { CloudRouter } from './cloud-routes'
import React from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import Login from '@/views/Login.tsx'
import { Layout } from '@/views/Layout/index.tsx'
import type { RouteObject } from 'react-router-dom'

const CommonRoutes: RouteObject[] = [
  {
    path: '*',
    element: React.createElement(Navigate, { to: '/home', replace: true }),
  },
  {
    path: '/login',
    element: React.createElement(Login),
  },
  {
    path: '/',
    element: React.createElement(Layout),
    errorElement: 'ErrorPage',
    children: [...CloudRouter],
  },
]

export const AppRouter = createBrowserRouter([...CommonRoutes])
