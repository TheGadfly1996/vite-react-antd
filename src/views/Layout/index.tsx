import type { MenuConfig } from '@/router/types'
import type { MenuDataItem, ProSettings } from '@ant-design/pro-components'

import {
  PageContainer,
  ProCard,
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components'
import { Suspense, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import Spin from '@/components/Spin'
import { hasPermission } from '@/hooks/useDynamicRoute'
import { menuRoutes } from '@/router/cloud-routes'
import { useAuthStore } from '@/store/auth'
import LanguageMenu from './LanguageMenu'

export const Layout = () => {
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({})

  // 重定向
  const location = useLocation()
  const navigate = useNavigate()
  const [pathname, setPathname] = useState(location.pathname)

  // 获取菜单数据
  const getMenu = (menus: MenuConfig[]): MenuDataItem[] => {
    const { roles } = useAuthStore.getState()

    return menus.map(({ meta, children, ...item }) => {
      if (item.permissions && hasPermission(roles, item.permissions)) {
        return {
          ...item,
          name: meta?.title,
          icon: meta?.icon && <div className={meta.icon}></div>,
          children: children ? getMenu(children) : undefined,
        }
      }
      return {}
    })
  }

  useEffect(() => {
    if (window.location.pathname === '/') navigate('/dolls-manage/model')
  }, [navigate])

  if (typeof document === 'undefined') {
    return <div />
  }
  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById('test-pro-layout') || document.body
          }}
        >
          <ProLayout
            layout="mix"
            {...settings}
            menu={{
              defaultOpenAll: true,
              ignoreFlatMenu: true,
              request: () => getMenu(menuRoutes),
            }}
            locale="zh-CN"
            prefixCls="my-prefix"
            token={{
              sider: {
                colorMenuBackground: '#fff',
                colorMenuItemDivider: '#dfdfdf',
                colorTextMenu: '#595959',
                colorTextMenuSelected: 'rgba(42,122,251,1)',
                colorBgMenuItemSelected: 'rgba(230,243,254,1)',
              },
            }}
            avatarProps={{
              src: 'https://files.catbox.moe/vpzre4.png',
              size: 'normal',
              render: (props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [{ key: 'logout', label: '退出登录' }],
                    }}
                  >
                    {dom}
                  </Dropdown>
                )
              },
            }}
            actionsRender={(props) => {
              if (props.isMobile) return []
              if (typeof window === 'undefined') return []
              return [<LanguageMenu />]
            }}
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <a>
                  {logo}
                  {title}
                </a>
              )
              if (typeof window === 'undefined') return defaultDom
              if (document.body.clientWidth < 1400) {
                return defaultDom
              }
              if (_.isMobile) return defaultDom
              return <>{defaultDom}</>
            }}
            menuFooterRender={(props) => {
              if (props?.collapsed) return undefined
              return (
                <div
                  style={{
                    textAlign: 'center',
                    paddingBlockStart: 12,
                  }}
                >
                  <div>© 2021 Made with love</div>
                  <div>by Ant Design</div>
                </div>
              )
            }}
            menuItemRender={(menuItemProps: MenuDataItem, defaultDom: React.ReactNode) => {
              if (menuItemProps.isUrl || menuItemProps.children) {
                return defaultDom
              }
              if (menuItemProps.path && location.pathname !== menuItemProps.path) {
                return (
                  <Link
                    to={menuItemProps.path}
                    target={menuItemProps.target}
                    className="flex items-center"
                    onClick={() => {
                      setPathname(menuItemProps.path || '/home')
                    }}
                  >
                    {defaultDom}
                  </Link>
                )
              }
              return defaultDom
            }}
          >
            <PageContainer
              token={{
                paddingInlinePageContainerContent: 40,
              }}
            >
              <ProCard
                style={{
                  height: '200vh',
                  minHeight: 800,
                }}
              >
                <Suspense>
                  <Spin />
                  <Outlet></Outlet>
                </Suspense>
              </ProCard>
            </PageContainer>

            <SettingDrawer
              pathname={pathname}
              enableDarkTheme
              getContainer={(e: any) => {
                if (typeof window === 'undefined') return e
                return document.getElementById('test-pro-layout')
              }}
              settings={settings}
              onSettingChange={(changeSetting) => {
                setSetting(changeSetting)
              }}
              disableUrlParams={false}
            />
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  )
}
