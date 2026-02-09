import Home from '@/components/Home.tsx'
import { lazy } from 'react'
import ErrorPage from '@/views/ErrorPage.tsx'

const Menu = lazy(() => import('@/views/permissions/menu/Menu.tsx'))
const ModelManage = lazy(() => import('@/views/DollsManage/ModelManage.tsx'))
const ImageConfig = lazy(() => import('@/views/DollsManage/ImageConfig.tsx'))

// 组件映射表 - 用于动态路由
export const componentsMap = {
  ErrorPage,
  Home,
  Menu,
  ModelManage,
  ImageConfig,
}
