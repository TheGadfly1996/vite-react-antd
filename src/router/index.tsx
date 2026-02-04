import { RouterProvider } from 'react-router-dom'
import React from 'react'
import { AppRouter } from './app-routes'

export const Routes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={AppRouter} />
    </Suspense>
  )
}
