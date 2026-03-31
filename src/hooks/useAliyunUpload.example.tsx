/**
 * useAliyunUpload Hook 使用示例
 * 
 * 本文件展示了如何在不同场景下使用阿里云视频上传 Hook
 */

import { Button, Progress, Space, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { useAliyunUpload } from './useAliyunUpload'
import type { UploadAuthInfo, STSTokenInfo } from './useAliyunUpload'

/**
 * 示例1: 使用上传地址和凭证方式（推荐）
 */
export function UploadAuthExample() {
  const upload = useAliyunUpload({
    userId: '123456', // 阿里云账号ID或自定义用户ID
    authType: 'uploadAuth',
    region: 'cn-shanghai',
    
    // 获取上传凭证（首次上传时调用）
    onGetUploadAuth: async (uploadInfo) => {
      console.log('正在获取上传凭证...', uploadInfo)
      
      // 调用后端接口获取上传凭证
      const response = await fetch('/api/vod/create-upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadInfo.file.name,
          fileName: uploadInfo.file.name,
        }),
      })
      
      const data = await response.json()
      
      return {
        UploadAuth: data.UploadAuth,
        UploadAddress: data.UploadAddress,
        VideoId: data.VideoId,
      } as UploadAuthInfo
    },
    
    // 刷新上传凭证（凭证过期或断点续传时调用）
    onRefreshUploadAuth: async (videoId) => {
      console.log('正在刷新上传凭证...', videoId)
      
      // 调用后端接口刷新凭证
      const response = await fetch('/api/vod/refresh-upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      })
      
      const data = await response.json()
      
      return {
        UploadAuth: data.UploadAuth,
        UploadAddress: data.UploadAddress,
        VideoId: data.VideoId,
      } as UploadAuthInfo
    },
  })

  // Ant Design Upload 组件配置
  const uploadProps: UploadProps = {
    accept: 'video/*',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      // 验证文件类型
      const isVideo = file.type.startsWith('video/')
      if (!isVideo) {
        message.error('只能上传视频文件')
        return Upload.LIST_IGNORE
      }

      // 验证文件大小（例如：最大 2GB）
      const maxSize = 2 * 1024 * 1024 * 1024
      if (file.size > maxSize) {
        message.error('文件大小不能超过 2GB')
        return Upload.LIST_IGNORE
      }

      // 添加到上传队列
      upload.addFile(file)
      
      // 阻止自动上传
      return false
    },
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>阿里云视频上传示例（上传地址和凭证方式）</h2>

      {/* 文件选择器 */}
      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽视频文件到此区域上传</p>
        <p className="ant-upload-hint">支持单个视频文件上传，最大 2GB</p>
      </Upload.Dragger>

      {/* 上传进度 */}
      {upload.status === 'uploading' && (
        <div style={{ marginTop: 16 }}>
          <p>正在上传: {upload.currentFile?.file.name}</p>
          <Progress percent={upload.progress} status="active" />
        </div>
      )}

      {/* 上传成功 */}
      {upload.status === 'success' && (
        <div style={{ marginTop: 16, color: '#52c41a' }}>
          ✅ 上传成功！
        </div>
      )}

      {/* 上传失败 */}
      {upload.status === 'error' && (
        <div style={{ marginTop: 16, color: '#ff4d4f' }}>
          ❌ 上传失败: {upload.error}
        </div>
      )}

      {/* 操作按钮 */}
      <Space style={{ marginTop: 16 }}>
        <Button
          type="primary"
          onClick={upload.startUpload}
          disabled={upload.fileList.length === 0 || upload.status === 'uploading'}
        >
          开始上传
        </Button>
        <Button
          onClick={upload.stopUpload}
          disabled={upload.status !== 'uploading'}
        >
          停止上传
        </Button>
        <Button onClick={upload.cleanList}>清空列表</Button>
      </Space>

      {/* 文件列表 */}
      {upload.fileList.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>上传队列 ({upload.fileList.length})</h4>
          <ul>
            {upload.fileList.map((item, index) => (
              <li key={index}>
                {item.file.name} ({(item.file.size / 1024 / 1024).toFixed(2)} MB)
                <Button
                  size="small"
                  danger
                  onClick={() => upload.deleteFile(index)}
                  style={{ marginLeft: 8 }}
                >
                  删除
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * 示例2: 使用 STS Token 方式
 */
export function STSTokenExample() {
  const upload = useAliyunUpload({
    userId: '123456',
    authType: 'stsToken',
    region: 'cn-shanghai',
    
    // 获取 STS Token
    onGetSTSToken: async (uploadInfo) => {
      console.log('正在获取 STS Token...', uploadInfo)
      
      const response = await fetch('/api/vod/get-sts-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      const data = await response.json()
      
      return {
        AccessKeyId: data.SecurityTokenInfo.AccessKeyId,
        AccessKeySecret: data.SecurityTokenInfo.AccessKeySecret,
        SecretToken: data.SecurityTokenInfo.SecretToken,
      } as STSTokenInfo
    },
    
    // 刷新 STS Token
    onRefreshSTSToken: async () => {
      console.log('正在刷新 STS Token...')
      
      const response = await fetch('/api/vod/refresh-sts-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      const data = await response.json()
      
      return {
        AccessKeyId: data.SecurityTokenInfo.AccessKeyId,
        AccessKeySecret: data.SecurityTokenInfo.AccessKeySecret,
        SecretToken: data.SecurityTokenInfo.SecretToken,
      } as STSTokenInfo
    },
  })

  const uploadProps: UploadProps = {
    accept: 'video/*',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      // 使用 STS Token 方式时可以传入额外的 userData
      const userData = {
        Title: file.name,
        Tags: '测试,视频上传',
        Description: '这是一个测试视频',
      }
      
      upload.addFile(file, userData)
      return false
    },
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>阿里云视频上传示例（STS Token 方式）</h2>

      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽视频文件到此区域上传</p>
        <p className="ant-upload-hint">使用 STS Token 授权方式</p>
      </Upload.Dragger>

      {upload.status === 'uploading' && (
        <div style={{ marginTop: 16 }}>
          <Progress percent={upload.progress} status="active" />
        </div>
      )}

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" onClick={upload.startUpload}>
          开始上传
        </Button>
        <Button onClick={upload.stopUpload}>停止上传</Button>
      </Space>
    </div>
  )
}

/**
 * 示例3: 带上传加速功能
 */
export function AccelerateUploadExample() {
  const upload = useAliyunUpload({
    userId: '123456',
    authType: 'uploadAuth',
    region: 'cn-shanghai',
    
    // 启用上传加速（需要提前开通）
    enableAccelerate: true,
    accelerateDomain: 'https://vod-*******.oss-accelerate.aliyuncs.com',
    
    onGetUploadAuth: async (uploadInfo) => {
      const response = await fetch('/api/vod/create-upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadInfo.file.name,
          fileName: uploadInfo.file.name,
        }),
      })
      
      const data = await response.json()
      return data as UploadAuthInfo
    },
    
    onRefreshUploadAuth: async (videoId) => {
      const response = await fetch('/api/vod/refresh-upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      })
      
      const data = await response.json()
      return data as UploadAuthInfo
    },
  })

  return (
    <div style={{ padding: 24 }}>
      <h2>阿里云视频上传示例（上传加速）</h2>
      <p style={{ color: '#666' }}>
        适用于上传大文件或跨区域上传场景，需要提前开通上传加速功能
      </p>
      
      {/* 上传界面省略，与示例1相同 */}
    </div>
  )
}

/**
 * 示例4: 多文件上传队列管理
 */
export function MultiFileUploadExample() {
  const upload = useAliyunUpload({
    userId: '123456',
    authType: 'uploadAuth',
    region: 'cn-shanghai',
    onGetUploadAuth: async () => {
      // 实现省略
      return {} as UploadAuthInfo
    },
    onRefreshUploadAuth: async () => {
      // 实现省略
      return {} as UploadAuthInfo
    },
  })

  const uploadProps: UploadProps = {
    accept: 'video/*',
    multiple: true, // 支持多文件选择
    showUploadList: false,
    beforeUpload: (file) => {
      upload.addFile(file)
      return false
    },
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>多文件上传队列管理</h2>

      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">支持多选，可批量上传</p>
      </Upload.Dragger>

      {/* 文件列表 */}
      {upload.fileList.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>上传队列 ({upload.fileList.length} 个文件)</h4>
          <ul>
            {upload.fileList.map((item, index) => (
              <li key={index} style={{ marginBottom: 8 }}>
                <Space>
                  <span>{item.file.name}</span>
                  <span style={{ color: '#999' }}>
                    ({(item.file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <Button size="small" onClick={() => upload.cancelFile(index)}>
                    取消
                  </Button>
                  <Button size="small" onClick={() => upload.resumeFile(index)}>
                    恢复
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => upload.deleteFile(index)}
                  >
                    删除
                  </Button>
                </Space>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" onClick={upload.startUpload}>
          开始上传全部
        </Button>
        <Button onClick={upload.stopUpload}>停止上传</Button>
        <Button onClick={upload.cleanList}>清空队列</Button>
      </Space>
    </div>
  )
}
