import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '@/utils/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * 路由守卫组件
 * 检查用户是否已登录，未登录则重定向到登录页
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation()
  const token = getToken()

  // 如果没有 token，重定向到登录页，并保存当前路径用于登录后跳转
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // 已登录，渲染子组件
  return <>{children}</>
}
