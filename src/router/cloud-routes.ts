import { lazy } from 'react'
import Home from '@/components/Home.tsx'
import ErrorPage from '../views/ErrorPage.tsx'
import { Layout } from '@/views/Layout/index.tsx'
import { GenerateRoutes } from '@/hooks/useDynamicRoute'

const Menu = lazy(() => import('@/views/permissions/menu/Menu.tsx'))
const DollsManage = lazy(() => import('@/views/dolls-manage/index.tsx'))

// 组件映射
export const componentsMap = {
  Layout,
  ErrorPage,
  Home,
  Menu,
  DollsManage,
}

// 角色到路由权限的映射

export const menuRoutes = [
  {
    path: '/home',
    element: 'Home',
    permissions: ['CLOUD'],
    meta: {
      title: '首页',
      icon: 'i-ant-design:menu-outlined',
    },
  },
  {
    path: '/menu-manage',
    element: 'Menu',
    permissions: ['ABC'],
    meta: {
      title: '菜单管理',
      icon: 'i-ant-design:menu-outlined',
    },
  },
  {
    path: '/dolls-manage',
    element: 'DollsManage',
    permissions: ['CLOUD'],
    meta: {
      title: '玩偶管理',
      icon: 'i-ant-design:user-outlined',
    },
  },
]

export const CloudRouter = GenerateRoutes(menuRoutes)
