import { getUploadAuth, refreshUploadAuth } from '@/axios/api/common'
import { loadJs } from '@/utils/dynamicLoadJs'
import { message } from 'antd'
import { useCallback, useRef, useState } from 'react'

/**
 * 默认的获取上传凭证方法
 * 提取到 Hook 外部，避免不必要的重复创建
 */
const defaultGetUploadAuth = async (uploadInfo: UploadInfo) => {
  try {
    const response = await getUploadAuth({
      video_name: uploadInfo.file.name,
      cover_url: '123',
      filename: uploadInfo.file.name,
    })
    return response.data
  } catch (error) {
    console.error('获取上传凭证失败:', error)
    throw error
  }
}

/**
 * 默认的刷新上传凭证方法
 * 提取到 Hook 外部，避免不必要的重复创建
 */
const defaultRefreshUploadAuth = async (videoId: string) => {
  try {
    const response = await refreshUploadAuth({ video_oss_id: videoId })
    return response.data
  } catch (error) {
    console.error('刷新上传凭证失败:', error)
    throw error
  }
}

/**
 * 上传授权方式
 */
export type AuthType = 'uploadAuth' | 'stsToken'

/**
 * 上传文件信息
 */
export interface UploadInfo {
  file: File
  videoId?: string
  endpoint?: string
  bucket?: string
  object?: string
}

/**
 * 上传进度信息
 */
export interface UploadProgress {
  file: File
  totalSize: number
  uploadedSize: number
  percent: number
}

/**
 * 上传凭证信息（上传地址和凭证方式）
 */
export interface UploadAuthInfo {
  UploadAuth: string
  UploadAddress: string
  VideoId: string
}

/**
 * STS Token 信息
 */
export interface STSTokenInfo {
  AccessKeyId: string
  AccessKeySecret: string
  SecretToken: string
}

/**
 * 上传配置
 */
export interface AliyunUploadConfig {
  /** 用户ID，用于标识上传者的身份，必填 */
  userId: string
  /** 上传到视频点播的地域，默认值为'cn-shanghai' */
  region?: string
  /** 分片大小，默认1MB，不能小于100KB */
  partSize?: number
  /** 并行上传分片个数，默认5 */
  parallel?: number
  /** 网络原因失败时，重新上传次数，默认为3 */
  retryCount?: number
  /** 网络原因失败时，重新上传间隔时间，默认为2秒 */
  retryDuration?: number
  /** 授权方式：uploadAuth(上传地址和凭证) 或 stsToken(STS Token) */
  authType: AuthType
  /** 获取上传凭证的方法（authType为uploadAuth时使用） */
  onGetUploadAuth?: (uploadInfo: UploadInfo) => Promise<UploadAuthInfo>
  /** 刷新上传凭证的方法（authType为uploadAuth时使用） */
  onRefreshUploadAuth?: (videoId: string) => Promise<UploadAuthInfo>
  /** 获取STS Token的方法（authType为stsToken时使用） */
  onGetSTSToken?: (uploadInfo: UploadInfo) => Promise<STSTokenInfo>
  /** 刷新STS Token的方法（authType为stsToken时使用） */
  onRefreshSTSToken?: () => Promise<STSTokenInfo>
  /** 是否启用上传加速 */
  enableAccelerate?: boolean
  /** 上传加速域名 */
  accelerateDomain?: string
}

/**
 * 上传状态
 */
export type UploadStatus = 'idle' | 'ready' | 'uploading' | 'success' | 'error' | 'stopped'

/**
 * Hook 返回值
 */
export interface UseAliyunUploadReturn {
  /** 当前上传状态 */
  status: UploadStatus
  /** 上传进度（0-100） */
  progress: number
  /** 错误信息 */
  error: string | null
  /** 上传文件列表 */
  fileList: UploadInfo[]
  /** 当前正在上传的文件信息 */
  currentFile: UploadInfo | null
  /** 添加文件到上传队列 */
  addFile: (file: File, userData?: Record<string, any>) => void
  /** 开始上传 */
  startUpload: () => void
  /** 停止上传 */
  stopUpload: () => void
  /** 删除指定文件 */
  deleteFile: (index: number) => void
  /** 取消单个文件上传 */
  cancelFile: (index: number) => void
  /** 恢复单个文件上传 */
  resumeFile: (index: number) => void
  /** 清空上传列表 */
  cleanList: () => void
  /** 获取断点信息 */
  getCheckpoint: (file: File) => any
}

export function useAliyunUpload(config: AliyunUploadConfig): UseAliyunUploadReturn {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [fileList, setFileList] = useState<UploadInfo[]>([])
  const [currentFile, setCurrentFile] = useState<UploadInfo | null>(null)

  const uploaderRef = useRef<any>(null)
  const isInitializedRef = useRef(false)

  /**
   * 初始化上传器
   */
  const initUploader = useCallback(async () => {
    if (isInitializedRef.current && uploaderRef.current) {
      return uploaderRef.current
    }

    try {
      // 1. 加载阿里云 OSS SDK
      await loadJs('/aliyun-upload/aliyun-oss-sdk-6.17.1.min.js')

      // 2. 加载阿里云上传 SDK
      await loadJs('/aliyun-upload/aliyun-upload-sdk-1.5.7.min.js')

      // 3. 获取上传 SDK
      const AliyunUpload = window.AliyunUpload
      if (!AliyunUpload) {
        throw new Error('阿里云上传 SDK 加载失败')
      }

      // 4. 创建上传实例
      uploaderRef.current = new AliyunUpload.Vod({
        userId: config.userId,
        region: config.region || 'cn-shanghai',
        partSize: config.partSize || 1048576,
        parallel: config.parallel || 5,
        retryCount: config.retryCount || 3,
        retryDuration: config.retryDuration || 2,

        // 开始上传回调
        onUploadstarted: async (uploadInfo: UploadInfo) => {
          console.log('📤 开始上传:', uploadInfo.file.name)
          setStatus('uploading')
          setCurrentFile(uploadInfo)
          setError(null)

          try {
            if (config.authType === 'uploadAuth') {
              // 上传地址和凭证方式
              if (!uploadInfo.videoId) {
                // 首次上传，获取凭证
                const getAuth = config.onGetUploadAuth || defaultGetUploadAuth
                const authInfo = await getAuth(uploadInfo)
                uploaderRef.current.setUploadAuthAndAddress(
                  uploadInfo,
                  authInfo.UploadAuth,
                  authInfo.UploadAddress,
                  authInfo.VideoId
                )
              } else {
                // 断点续传，刷新凭证
                console.log('🔄 检测到断点，从断点处继续上传')
                console.log('📍 断点信息:', uploaderRef.current.getCheckpoint(uploadInfo.file))

                const refreshAuth = config.onRefreshUploadAuth || defaultRefreshUploadAuth
                const authInfo = await refreshAuth(uploadInfo.videoId)
                uploaderRef.current.setUploadAuthAndAddress(
                  uploadInfo,
                  authInfo.UploadAuth,
                  authInfo.UploadAddress,
                  authInfo.VideoId
                )
              }
            } else if (config.authType === 'stsToken') {
              // STS Token 方式
              if (!config.onGetSTSToken) {
                throw new Error('请配置 onGetSTSToken 方法')
              }
              const stsInfo = await config.onGetSTSToken(uploadInfo)
              uploaderRef.current.setSTSToken(
                uploadInfo,
                stsInfo.AccessKeyId,
                stsInfo.AccessKeySecret,
                stsInfo.SecretToken
              )
            }
          } catch (err: any) {
            console.error('❌ 获取上传凭证失败:', err)
            setError(err.message || '获取上传凭证失败')
            setStatus('error')
          }
        },

        // 文件上传成功回调
        onUploadSucceed: (uploadInfo: UploadInfo) => {
          console.log('✅ 上传成功:', uploadInfo.file.name)
          console.log('📦 文件信息:', {
            endpoint: uploadInfo.endpoint,
            bucket: uploadInfo.bucket,
            object: uploadInfo.object,
            videoId: uploadInfo.videoId,
          })
          setStatus('success')
          setProgress(100)
          message.success(`${uploadInfo.file.name} 上传成功`)
        },

        // 文件上传失败回调
        onUploadFailed: (uploadInfo: UploadInfo, code: string, msg: string) => {
          console.error('❌ 上传失败:', uploadInfo.file.name, code, msg)
          setStatus('error')
          setError(`${code}: ${msg}`)
          message.error(`${uploadInfo.file.name} 上传失败: ${msg}`)
        },

        // 文件上传进度回调
        onUploadProgress: (uploadInfo: UploadInfo, totalSize: number, loadedPercent: number) => {
          const percent = Math.ceil(loadedPercent * 100)
          setProgress(percent)
          console.log(`📊 上传进度: ${uploadInfo.file.name} - ${percent}%`)
        },

        // 上传凭证或STS Token超时回调
        onUploadTokenExpired: async (uploadInfo: UploadInfo) => {
          console.warn('⏰ 上传凭证超时，正在刷新...')

          try {
            if (config.authType === 'uploadAuth') {
              const refreshAuth = config.onRefreshUploadAuth || defaultRefreshUploadAuth
              const authInfo = await refreshAuth(uploadInfo.videoId!)
              uploaderRef.current.resumeUploadWithAuth(authInfo.UploadAuth)
              console.log('✅ 凭证刷新成功，继续上传')
            } else if (config.authType === 'stsToken') {
              if (!config.onRefreshSTSToken) {
                throw new Error('请配置 onRefreshSTSToken 方法')
              }
              const stsInfo = await config.onRefreshSTSToken()
              uploaderRef.current.resumeUploadWithSTSToken(
                stsInfo.AccessKeyId,
                stsInfo.AccessKeySecret,
                stsInfo.SecretToken
              )
              console.log('✅ STS Token 刷新成功，继续上传')
            }
          } catch (err: any) {
            console.error('❌ 刷新凭证失败:', err)
            setError(err.message || '刷新凭证失败')
            setStatus('error')
          }
        },

        // 全部文件上传结束回调
        onUploadEnd: (uploadInfo: UploadInfo) => {
          console.log('🎉 所有文件上传完成')
          setCurrentFile(null)
        },
      })

      isInitializedRef.current = true
      setStatus('ready')
      console.log('✅ 上传器初始化成功')

      return uploaderRef.current
    } catch (err: any) {
      console.error('❌ 上传器初始化失败:', err)
      setError(err.message || '上传器初始化失败')
      setStatus('error')
      throw err
    }
  }, [config])

  /**
   * 添加文件到上传队列
   */
  const addFile = useCallback(
    async (file: File, userData?: Record<string, any>) => {
      try {
        const uploader = await initUploader()

        // 构建 userData 参数
        let paramData: string | null = null
        if (config.authType === 'stsToken') {
          const userDataObj: any = { Vod: {} }

          // 添加用户自定义数据
          if (userData) {
            userDataObj.Vod = { ...userData }
          }

          // 添加上传加速配置
          if (config.enableAccelerate && config.accelerateDomain) {
            userDataObj.Vod.UserData = {
              AccelerateConfig: {
                Type: 'oss',
                Domain: config.accelerateDomain,
              },
            }
          }

          paramData = JSON.stringify(userDataObj)
        }

        // 添加文件
        uploader.addFile(file, null, null, null, paramData)

        // 更新文件列表
        const list = uploader.listFiles()
        setFileList(list)

        console.log('📄 文件添加成功:', file.name)
        message.success(`${file.name} 已添加到上传队列`)
      } catch (err: any) {
        console.error('❌ 添加文件失败:', err)
        message.error('添加文件失败')
      }
    },
    [initUploader, config]
  )

  /**
   * 开始上传
   */
  const startUpload = useCallback(async () => {
    try {
      const uploader = await initUploader()

      if (!uploader.listFiles().length) {
        message.warning('请先添加文件')
        return
      }

      uploader.startUpload()
      console.log('🚀 开始上传')
    } catch (err: any) {
      console.error('❌ 开始上传失败:', err)
      message.error('开始上传失败')
    }
  }, [initUploader])

  /**
   * 停止上传
   */
  const stopUpload = useCallback(() => {
    if (uploaderRef.current) {
      uploaderRef.current.stopUpload()
      setStatus('stopped')
      console.log('⏸️ 停止上传')
      message.info('已停止上传')
    }
  }, [])

  /**
   * 删除指定文件
   */
  const deleteFile = useCallback((index: number) => {
    if (uploaderRef.current) {
      uploaderRef.current.deleteFile(index)
      const list = uploaderRef.current.listFiles()
      setFileList(list)
      console.log('🗑️ 删除文件:', index)
    }
  }, [])

  /**
   * 取消单个文件上传
   */
  const cancelFile = useCallback((index: number) => {
    if (uploaderRef.current) {
      uploaderRef.current.cancelFile(index)
      console.log('❌ 取消文件上传:', index)
      message.info('已取消上传')
    }
  }, [])

  /**
   * 恢复单个文件上传
   */
  const resumeFile = useCallback((index: number) => {
    if (uploaderRef.current) {
      uploaderRef.current.resumeFile(index)
      console.log('▶️ 恢复文件上传:', index)
    }
  }, [])

  /**
   * 清空上传列表
   */
  const cleanList = useCallback(() => {
    if (uploaderRef.current) {
      uploaderRef.current.cleanList()
      setFileList([])
      setProgress(0)
      setStatus('ready')
      console.log('🧹 清空上传列表')
    }
  }, [])

  /**
   * 获取断点信息
   */
  const getCheckpoint = useCallback((file: File) => {
    if (uploaderRef.current) {
      return uploaderRef.current.getCheckpoint(file)
    }
    return null
  }, [])

  return {
    status,
    progress,
    error,
    fileList,
    currentFile,
    addFile,
    startUpload,
    stopUpload,
    deleteFile,
    cancelFile,
    resumeFile,
    cleanList,
    getCheckpoint,
  }
}
