import type { ProSettings, MenuDataItem } from '@ant-design/pro-components'
import { PageContainer, ProCard, ProConfigProvider, ProLayout, SettingDrawer } from '@ant-design/pro-components'
import Spin from '@/components/Spin'
import LanguageMenu from './LanguageMenu'

import { Suspense, useState } from 'react'
import { defaultProps } from './props'
import { Outlet, Link, useLocation } from 'react-router-dom'

export const Layout = () => {
	const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({})

	const location = useLocation()
	const [pathname, setPathname] = useState(location.pathname)

	if (typeof document === 'undefined') {
		return <div />
	}
	return (
		<div
			id='test-pro-layout'
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
						layout='mix'
						{...defaultProps}
						{...settings}
						menu={{
							defaultOpenAll: true,
							ignoreFlatMenu: true,
						}}
						locale='zh-CN'
						prefixCls='my-prefix'
						location={{
							pathname,
						}}
						token={{
							sider: {},
						}}
						avatarProps={{
							src: 'https://files.catbox.moe/vpzre4.png',
							size: 'normal',
							render: (props, dom) => {
								return (
									<Dropdown
										menu={{
											items: [
												{
													key: 'logout',
													label: '退出登录',
												},
											],
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
						onMenuHeaderClick={(e) => console.log(e)}
						menuItemRender={(menuItemProps: MenuDataItem, defaultDom: React.ReactNode) => {
							if (menuItemProps.isUrl || menuItemProps.children) {
								return defaultDom
							}
							if (menuItemProps.path && location.pathname !== menuItemProps.path) {
								return (
									<Link
										to={menuItemProps.path}
										target={menuItemProps.target}
										className='flex items-center'
										onClick={() => {
											setPathname(menuItemProps.path || '/home')
										}}
									>
										{/* {menuItemProps.pro_layout_parentKeys && menuItemProps.pro_layout_parentKeys.length > 0 && menuItemProps.icon} */}
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
