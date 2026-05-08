import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 md:p-8">
      <div className="max-w-4xl w-full text-center">
        {/* Main 404 Number */}
        <div className="mb-12 md:mb-16">
          <h1 className="text-[120px] text-black font-bold leading-none tracking-tighter lg:text-[280px] md:text-[200px]">
            404
          </h1>
        </div>

        {/* Accent Line */}
        <div className="mx-auto mb-8 h-1 w-24 bg-[#ff3366] md:mb-12" />

        {/* Message */}
        <div className="mb-12 md:mb-16 space-y-4 md:space-y-6">
          <h2 className="text-2xl text-black font-bold tracking-tight md:text-4xl">页面未找到</h2>
          <p className="mx-auto max-w-xl text-base text-black leading-relaxed md:text-lg">
            您访问的页面不存在或已被移除。
            <br className="hidden md:block" />
            请检查 URL 或登录后继续浏览。
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-16 flex flex-col items-center justify-center gap-4 md:mb-24 sm:flex-row md:gap-6">
          <button
            onClick={() => navigate('/')}
            className="w-full border-2 border-black bg-black px-8 py-4 text-white font-medium transition-colors duration-200 sm:w-auto hover:bg-white md:px-12 md:py-5 hover:text-black"
          >
            <span className="flex cursor-pointer items-center justify-center gap-2">
              <span className="i-ant-design:home-outlined text-xl" />
              <span className="text-sm md:text-base">返回首页</span>
            </span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full cursor-pointer border-2 border-black bg-white px-8 py-4 text-black font-medium transition-colors duration-200 sm:w-auto hover:bg-black md:px-12 md:py-5 hover:text-white"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="i-ant-design:arrow-left-outlined text-xl" />
              <span className="text-sm md:text-base">重新登录</span>
            </span>
          </button>
        </div>

        {/* Minimal Footer */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-2 w-2 rounded-full bg-black" />
          <p className="text-xs text-black tracking-widest uppercase md:text-sm">ERROR 404</p>
          <div className="h-2 w-2 rounded-full bg-[#ff3366]" />
        </div>
      </div>
    </div>
  )
}
