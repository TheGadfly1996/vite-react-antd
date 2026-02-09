import { GenerateRoutes } from '@/hooks/useDynamicRoute'

// 角色到路由权限的映射

export const menuRoutes = [
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
    redirect: '/dolls-manage/model',
    permissions: ['CLOUD'],
    meta: {
      title: '玩偶管理',
      icon: 'i-mdi-robot-angry-outline',
    },
    children: [
      {
        path: '/dolls-manage/model',
        element: 'ModelManage',
        permissions: ['CLOUD'],
        meta: {
          title: '型号管理',
          icon: 'i-ant-design:appstore-outlined',
        },
      },
      {
        path: '/dolls-manage/image',
        element: 'ImageConfig',
        permissions: ['CLOUD'],
        meta: {
          title: '图片配置',
          icon: 'i-ant-design:picture-outlined',
        },
      },
    ],
  },
  {
    path: '/sn-manage',
    element: 'DollsManage',
    permissions: ['CLOUD'],
    meta: {
      title: 'SN管理',
      icon: 'i-ant-design:barcode-outlined',
    },
  },
  {
    path: '/ota-manage',
    element: 'DollsManage',
    permissions: ['CLOUD'],
    meta: {
      title: 'OTA管理',
      icon: 'i-ant-design:cloud-upload-outlined',
    },
  },
]

export const CloudRouter = GenerateRoutes(menuRoutes)
