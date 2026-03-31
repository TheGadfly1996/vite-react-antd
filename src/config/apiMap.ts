/**
 * development:开发
 * test:测试
 * production:生产环境
 */
// 根据当前用户动态切换api
export const clientApiMap = new Map([
  [
    'development',
    {
      ZH: 'https://test-robosenmall.robosen.cn',
      EN: 'https://dev-en-intelligentcloud.robosenhub.com',
      EU: 'https://dev-eu-intelligentcloud.robosenhub.com',
    },
  ],
  [
    'test',
    {
      ZH: 'https://dev-intelligentcloud.robosenhub.cn',
      EN: 'https://dev-en-intelligentcloud.robosenhub.com',
      EU: 'https://dev-eu-intelligentcloud.robosenhub.com',
    },
  ],
  [
    'pre',
    {
      ZH: 'https://pre-intelligentcloud.robosenhub.cn',
      EN: 'https://pre-intelligentcloud.robosenhub.com/',
      EU: 'https://pre-intelligentcloud.robosenhub.com/',
    },
  ],
  [
    'production',
    {
      ZH: 'https://intelligentcloud.robosen.cn/',
      EN: 'https://intelligentcloud.robosen.com/',
      EU: 'https://intelligentcloud-eu.robosenhub.com/',
    },
  ],
])
export const adminApiMap = new Map([
  [
    'development',
    {
      ZH: '/adminZH',
      EN: '/adminEN',
      EU: '/adminEU',
    },
  ],
  [
    'test',
    {
      ZH: 'https://test-api-admin.robosen.cn',
      EN: 'https://test-api-admin.robosen.com',
      EU: 'https://test-eu-api-admin.robosen.com',
    },
  ],
  [
    'pre',
    {
      ZH: 'https://api-admin.robosenhub.cn',
      EN: 'https://api-admin.robosenhub.com',
      EU: 'https://eu-api-admin.robosenhub.com',
    },
  ],
  [
    'production',
    {
      ZH: 'https://api-admin.robosen.cn',
      EN: 'https://api-admin.robosen.com',
      EU: 'https://eu-api-admin.robosen.com',
    },
  ],
])

const proxyMap: Record<string, string> = {
  adminZH: 'https://test-api-admin.robosen.cn',
  adminEN: 'https://test-api-admin.robosen.com',
  adminEU: 'https://test-eu-api-admin.robosen.com',
}

export const proxy: Record<string, any> = {}
Object.keys(proxyMap).forEach((key) => {
  proxy[`/${key}`] = {
    target: proxyMap[key],
    changeOrigin: true,
    rewrite: (path: string) => path.replace(new RegExp(`^/${key}`), ''),
  }
})
