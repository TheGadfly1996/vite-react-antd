import { useAuthStore } from '@/store/auth'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore.use.login()
  const getInfo = useAuthStore.use.getInfo()

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true)
    // 执行登录
    try {
      await login(values)
      await getInfo()
      messageApi.success('登录成功')

      const from = location.state.from || '/'
      navigate(from, { replace: true })
    } catch (error: unknown) {
      messageApi.error((error as AxiosResponseType)?.msg || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden from-[#0a0e17] to-[#0f1419] bg-gradient-to-br">
        {/* Animated background grid */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
          animate={{ x: [0, 50], y: [0, 50] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Decorative geometric shapes */}
        <motion.div
          className="absolute left-5% top-10% h-300px w-300px border-2 border-cyan-400/10 rounded-full"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-15% right-10% h-200px w-200px rotate-45 border-2 border-cyan-400/10"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
            rotate: [45, 165, 285, 405],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div
          className="absolute left-15% top-60% h-150px w-150px border-2 border-fuchsia-500/10"
          style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />

        {/* Main content */}
        <motion.div
          className="relative z-10 grid grid-cols-1 max-w-1200px w-90% gap-15 p-10 lg:grid-cols-2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left side - branding */}
          <motion.div
            className="flex flex-col items-center justify-center gap-8 text-center lg:items-start lg:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          >
            <h1 className="flex flex-col gap-2">
              <span
                className="relative text-[56px] text-white font-bold leading-none tracking-tight"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'linear-gradient(135deg, #ffffff 0%, #00fff2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ROBOSEN
                <span className="absolute bottom--2 left-0 h-1 w-20 from-cyan-400 to-transparent bg-gradient-to-r" />
              </span>
              <motion.span
                className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 tracking-[3px] font-mono uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-cyan-400"
                  style={{ boxShadow: '0 0 8px #00fff2' }}
                />
                智能迷你管理后台
                <span className="text-cyan-400">/ ADMIN PORTAL</span>
              </motion.span>
            </h1>
          </motion.div>

          {/* Right side - login form */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div
              className="relative max-w-450px w-full border-2 border-slate-700 bg-[#111827] p-10"
              style={{
                boxShadow: '0 0 0 1px rgba(0, 255, 242, 0.1), 0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Top scan line */}
              <motion.div
                className="absolute left-0 right-0 top-0 h-0.5 from-transparent via-cyan-400 to-transparent bg-gradient-to-r"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              <div className="mb-8">
                <h2
                  className="mb-3 text-[20px] text-white font-bold tracking-wider"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  登录
                </h2>
              </div>

              <Form onFinish={handleSubmit} className="flex flex-col gap-6">
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                  className="mb-0"
                >
                  <Input
                    prefix={<UserOutlined className="text-[18px] text-cyan-400" />}
                    placeholder="输入用户名"
                    size="large"
                    className="login-input h-[56px] border-2 border-slate-800 bg-black/30 text-[16px] text-white font-mono transition-all duration-300"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                  className="mb-0"
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-[18px] text-cyan-400" />}
                    placeholder="输入密码"
                    size="large"
                    className="login-input h-[56px] border-2 border-slate-800 bg-black/30 text-[16px] text-white font-mono transition-all duration-300"
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    disabled={loading}
                    className="login-button relative h-[56px] overflow-hidden border-none text-[16px] font-bold tracking-[3px] transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #00fff2 0%, #00d4c8 100%)',
                      fontFamily: 'Rajdhani, sans-serif',
                      color: '#0a0e17',
                    }}
                  >
                    <span className="relative z-10">{loading ? '认证中...' : '认证登录'}</span>
                    {!loading && (
                      <motion.div
                        className="absolute top-0 h-full w-full from-transparent via-white/30 to-transparent bg-gradient-to-r"
                        animate={{ left: ['-100%', '100%'] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          repeatDelay: 0,
                        }}
                      />
                    )}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </motion.div>
        </motion.div>

        <style>
          {`
					.login-input:hover,
					.login-input:focus {
						border-color: #00fff2 !important;
						box-shadow: 0 0 20px rgba(0, 255, 242, 0.1) !important;
						background: rgba(0, 0, 0, 0.4) !important;
					}

					.login-input .ant-input,
					.login-input .ant-input-password input {
						background: transparent !important;
						color: #fff !important;
						font-family: monospace !important;
						font-size: 16px !important;
					}

					.login-input input::placeholder {
						color: #94a3b8 !important;
						font-size: 16px !important;
					}

					.login-input .ant-input-prefix {
						margin-right: 12px !important;
					}

					.login-input .ant-input-suffix {
						color: #94a3b8 !important;
					}

					.login-button:hover {
						transform: translateY(-2px) !important;
						box-shadow: 0 10px 30px rgba(0, 255, 242, 0.4) !important;
					}

					.login-button:active {
						transform: translateY(0) !important;
					}

					.ant-form-item-explain-error {
						font-family: monospace !important;
						font-size: 12px !important;
						color: #ff00ff !important;
						margin-top: 8px !important;
					}
				`}
        </style>
      </div>
    </>
  )
}
