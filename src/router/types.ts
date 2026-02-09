import type { RouteObject } from 'react-router-dom'

type RouteMeta = {
  title: string
  icon: string
}

export type MenuConfig = {
  path: string
  element?: string
  permissions?: string[]
  children?: MenuConfig[]
  meta?: RouteMeta
}
export type RouteConfigRaw = Omit<
  RouteObject,
  'element' | 'children' | 'errorElement' | 'index'
> & {
  index?: false
  element: string
  errorElement?: string
  permissions?: string[]
  children?: RouteConfigRaw[]
  meta?: RouteMeta
}

export type RouteConfig = RouteObject & {
  permissions?: string[]
  children?: RouteConfig[]
  meta?: RouteMeta
}
