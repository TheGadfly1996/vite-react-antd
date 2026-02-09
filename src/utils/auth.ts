// src/utils/auth.ts
// Token 管理工具函数

const TOKEN_KEY = 'token'
const ACCOUNT_KEY = 'account'

export interface TokenData {
  admin_token: string
  admin_account: string
}

/**
 * 获取 token
 */
export const getToken = (): string => {
  return window.localStorage.getItem(TOKEN_KEY) || ''
}

/**
 * 设置 token
 */
export const setToken = (data: TokenData): void => {
  window.localStorage.setItem(TOKEN_KEY, data.admin_token)
  window.localStorage.setItem(ACCOUNT_KEY, data.admin_account)
}

/**
 * 移除 token
 */
export const removeToken = (): void => {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(ACCOUNT_KEY)
}

/**
 * 获取账户名
 */
export const getAccount = (): string => {
  return window.localStorage.getItem(ACCOUNT_KEY) || ''
}
