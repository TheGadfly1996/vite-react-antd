const scriptMap = new Map<string, Promise<void>>()

/**
 * 动态加载 JS 脚本 (单例模式/防重复/支持并发)
 * @param src 脚本地址
 * @returns Promise<void>
 */
export function loadJs(src: string): Promise<void> {
  if (scriptMap.has(src)) {
    return scriptMap.get(src)!
  }

  const scriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    script.async = true

    script.onload = () => {
      resolve()
    }

    script.onerror = (err) => {
      scriptMap.delete(src)
      script.remove()
      reject(err)
    }

    document.head.appendChild(script)
  })

  scriptMap.set(src, scriptPromise)

  return scriptPromise
}
