import type { MenuConfig, RouteConfig } from '@/router/types'
import { useAuthStore } from '@/store/auth'
import React from 'react'
import { componentsMap } from '@/router/components-map'

export const hasPermission = (roles: string[], permissions: string[]) => {
  return roles.some((role) => permissions.includes(role))
}

export const GenerateRoutes = (routes: MenuConfig[]): RouteConfig[] => {
  const { roles } = useAuthStore.getState()

  return routes.flatMap((item) => {
    if (!item.permissions || hasPermission(roles, item.permissions)) {
      const ElementComponent = item.element
        ? componentsMap[item.element as keyof typeof componentsMap]
        : undefined

      return [
        {
          ...item,
          element: ElementComponent ? React.createElement(ElementComponent) : undefined,
          children: item.children ? GenerateRoutes(item.children) : [],
        },
      ]
    }
    return []
  })
}
