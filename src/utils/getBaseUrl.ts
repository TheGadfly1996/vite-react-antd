import { adminApiMap, clientApiMap } from '@/config/apiMap'

/**
 * 获取baseURL
 * @param {string} url
 * @param {'ZH'|'EN'|'EU'} region
 * @returns {string}
 */

const getBaseURL = (url = '', region: 'ZH' | 'EN' | 'EU') => {
  console.log(url)

  if (['/account/admin/login', '/account/admin/profile'].includes(url)) {
    console.log(adminApiMap.get(import.meta.env.VITE_APP_ENV)?.[region])
    return adminApiMap.get(import.meta.env.VITE_APP_ENV)?.[region] || ''
  }

  return clientApiMap.get(import.meta.env.VITE_APP_ENV)?.[region] || ''
}
export default getBaseURL
