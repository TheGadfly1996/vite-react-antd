import type { MenuConfig, RouteConfig } from '@/router/types'
import { useAuthStore } from '@/store/auth'
import React from 'react'
import { componentsMap } from '@/router/cloud-routes'

export const hasPermission = (roles: string[], permissions: string[]) => {
  return roles.some((role) => permissions.includes(role))
}

export const GenerateRoutes = (routes: MenuConfig[]): RouteConfig[] => {
  const { roles } = useAuthStore.getState()

  return routes.flatMap((item) => {
    const ElementComponent =
      componentsMap[item.element as keyof typeof componentsMap]

    if (!item.permissions || hasPermission(roles, item.permissions)) {
      return [
        {
          ...item,
          element: React.createElement(ElementComponent),
          children: item.children ? GenerateRoutes(item.children) : [],
        },
      ]
    }
    return []
  })
}
