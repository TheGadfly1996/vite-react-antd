import { adminApiMap, clientApiMap } from '@/config/apiMap'

/**
 * 获取baseURL
 * @param {string} url
 * @param {'ZH'|'EN'|'EU'} region
 * @returns {string}
 */

const getBaseURL = (url = '', region: 'ZH' | 'EN' | 'EU') => {
  if (['/account/admin/login', '/account/admin/profile'].includes(url)) {
    return adminApiMap.get(import.meta.env.VITE_APP_ENV)?.[region] || ''
  }

  return clientApiMap.get(import.meta.env.VITE_APP_ENV)?.[region] || ''
}
export default getBaseURL
