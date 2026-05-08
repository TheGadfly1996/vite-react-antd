import { getUserInfo, login } from '@/axios/api/login'
import { RSA } from '@/utils/encrypt'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import createSelectors from './selectors'

interface AuthState {
  token: string
  name: string
  avatar: string
  roles: string[]
  account: string
}

interface UserProfile {
  name: string
  avatar: string
  account: string
}

interface AuthActions {
  login: (userInfo: {
    username: string
    password: string
  }) => Promise<{ admin_token: string; admin_account: string }>
  getInfo: () => Promise<{
    roles: string[]
    username: string
    roles_list: string[]
    avatar: string
  }>
  logout: () => void
  setToken: (token: string, account: string) => void
  setUserProfile: (profile: UserProfile) => void
  setRoles: (roles: string[]) => void
  resetState: () => void
}

type AuthStore = AuthState & AuthActions

// 初始状态
const getDefaultState = (): AuthState => ({
  token: window.localStorage.getItem('Authorization') || '',
  name: '',
  avatar: '',
  roles: [],
  account: window.localStorage.getItem('account') || '',
})

export const useAuthStore = createSelectors(
  create<AuthStore>()(
    persist(
      (set, get) => ({
        ...getDefaultState(),

        setToken: (token: string, account: string) => {
          window.localStorage.setItem('token', token)
          window.localStorage.setItem('account', account)
          set({ token, account })
        },

        setUserProfile: (profile: UserProfile) => {
          const updates: Partial<AuthState> = {}

          updates.name = profile.name
          updates.avatar = profile.avatar
          updates.account = profile.account

          set(updates)
        },

        setRoles: (roles: string[]) => set({ roles }),

        resetState: () => set(getDefaultState()),

        login: async (userInfo: {
          username: string
          password: string
        }): Promise<{ admin_token: string; admin_account: string }> => {
          const { username, password } = userInfo

          const response = await login({
            account: username.trim(),
            password: RSA(password),
          })

          const { admin_token, admin_account } = response
          get().setToken(admin_token, admin_account)

          return response
        },

        // 获取用户信息
        getInfo: async () => {
          const { account } = get()
          const data = await getUserInfo({ admin_account: account })

          if (!data) {
            throw new Error('验证失败,请重新登录')
          }

          const { roles, username } = data
          if (!roles || roles.length <= 0) {
            throw new Error('用户角色为空')
          }

          get().setUserProfile({
            name: username,
            avatar: data.avatar,
            account,
          })
          get().setRoles(roles)

          return data
        },

        logout: () => {
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('account')

          get().resetState()
        },
      }),
      {
        name: 'auth-storage',
        // 只持久化部分状态
        partialize: (state) => ({
          token: state.token,
          account: state.account,
          name: state.name,
          avatar: state.avatar,
          roles: state.roles,
        }),
      }
    )
  )
)
