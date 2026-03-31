# useAliyunUpload Hook 使用文档

> 基于阿里云视频点播 JavaScript SDK 封装的 React Hook，支持视频上传、进度监控、断点续传等完整功能。

## 📋 目录

- [特性](#特性)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
- [使用示例](#使用示例)
- [常见问题](#常见问题)
- [最佳实践](#最佳实践)

---

## ✨ 特性

- ✅ **两种授权方式**：支持上传地址和凭证、STS Token 两种授权方式
- ✅ **断点续传**：网络中断后自动从断点继续上传
- ✅ **进度监控**：实时获取上传进度（0-100%）
- ✅ **队列管理**：支持多文件上传队列管理
- ✅ **上传加速**：支持 OSS 传输加速（需提前开通）
- ✅ **错误处理**：完善的错误处理和凭证刷新机制
- ✅ **TypeScript**：完整的 TypeScript 类型定义
- ✅ **日志输出**：详细的控制台日志，便于调试

---

## 🚀 快速开始

### 1. 准备工作

确保已将阿里云上传 SDK 文件放置在 `/public/aliyun-upload/` 目录：

```
public/
└── aliyun-upload/
    └── aliyun-upload-sdk-1.5.7.min.js
```

### 2. 基础使用

```tsx
import { useAliyunUpload } from '@/hooks/useAliyunUpload'

function VideoUpload() {
  const upload = useAliyunUpload({
    userId: '123456', // 阿里云账号ID或自定义用户ID
    authType: 'uploadAuth',
    
    // 获取上传凭证
    onGetUploadAuth: async (uploadInfo) => {
      const res = await fetch('/api/vod/create-upload-video', {
        method: 'POST',
        body: JSON.stringify({ title: uploadInfo.file.name }),
      })
      return res.json()
    },
    
    // 刷新上传凭证
    onRefreshUploadAuth: async (videoId) => {
      const res = await fetch('/api/vod/refresh-upload-video', {
        method: 'POST',
        body: JSON.stringify({ videoId }),
      })
      return res.json()
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      upload.addFile(file)
      upload.startUpload()
    }
  }

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      {upload.status === 'uploading' && <p>上传进度: {upload.progress}%</p>}
      {upload.status === 'success' && <p>上传成功！</p>}
      {upload.status === 'error' && <p>上传失败: {upload.error}</p>}
    </div>
  )
}
```

---

## 📚 API 文档

### useAliyunUpload(config)

主 Hook 函数，用于创建上传实例。

#### 参数: `AliyunUploadConfig`

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `userId` | `string` | ✅ | - | 用户ID，用于标识上传者身份 |
| `authType` | `'uploadAuth' \| 'stsToken'` | ✅ | - | 授权方式 |
| `region` | `string` | ❌ | `'cn-shanghai'` | 点播地域标识 |
| `partSize` | `number` | ❌ | `1048576` | 分片大小（字节），最小 100KB |
| `parallel` | `number` | ❌ | `5` | 并行上传分片个数 |
| `retryCount` | `number` | ❌ | `3` | 失败重试次数 |
| `retryDuration` | `number` | ❌ | `2` | 重试间隔（秒） |
| `enableAccelerate` | `boolean` | ❌ | `false` | 是否启用上传加速 |
| `accelerateDomain` | `string` | ❌ | - | 上传加速域名 |

**授权方式相关配置：**

当 `authType` 为 `'uploadAuth'` 时：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `onGetUploadAuth` | `(uploadInfo: UploadInfo) => Promise<UploadAuthInfo>` | ✅ | 获取上传凭证的方法 |
| `onRefreshUploadAuth` | `(videoId: string) => Promise<UploadAuthInfo>` | ✅ | 刷新上传凭证的方法 |

当 `authType` 为 `'stsToken'` 时：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `onGetSTSToken` | `(uploadInfo: UploadInfo) => Promise<STSTokenInfo>` | ✅ | 获取 STS Token 的方法 |
| `onRefreshSTSToken` | `() => Promise<STSTokenInfo>` | ✅ | 刷新 STS Token 的方法 |

#### 返回值: `UseAliyunUploadReturn`

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `status` | `UploadStatus` | 当前上传状态 |
| `progress` | `number` | 上传进度（0-100） |
| `error` | `string \| null` | 错误信息 |
| `fileList` | `UploadInfo[]` | 上传文件列表 |
| `currentFile` | `UploadInfo \| null` | 当前正在上传的文件 |
| `addFile` | `(file: File, userData?: Record<string, any>) => void` | 添加文件到上传队列 |
| `startUpload` | `() => void` | 开始上传 |
| `stopUpload` | `() => void` | 停止上传 |
| `deleteFile` | `(index: number) => void` | 删除指定文件 |
| `cancelFile` | `(index: number) => void` | 取消单个文件上传 |
| `resumeFile` | `(index: number) => void` | 恢复单个文件上传 |
| `cleanList` | `() => void` | 清空上传列表 |
| `getCheckpoint` | `(file: File) => any` | 获取断点信息 |

### 类型定义

#### UploadStatus

```typescript
type UploadStatus = 'idle' | 'ready' | 'uploading' | 'success' | 'error' | 'stopped'
```

- `idle`: 初始状态
- `ready`: 上传器已就绪
- `uploading`: 上传中
- `success`: 上传成功
- `error`: 上传失败
- `stopped`: 已停止

#### UploadInfo

```typescript
interface UploadInfo {
  file: File            // 文件对象
  videoId?: string      // 视频ID（断点续传时存在）
  endpoint?: string     // OSS endpoint
  bucket?: string       // OSS bucket
  object?: string       // OSS object key
}
```

#### UploadAuthInfo

```typescript
interface UploadAuthInfo {
  UploadAuth: string      // 上传凭证
  UploadAddress: string   // 上传地址
  VideoId: string         // 视频ID
}
```

#### STSTokenInfo

```typescript
interface STSTokenInfo {
  AccessKeyId: string       // AccessKey ID
  AccessKeySecret: string   // AccessKey Secret
  SecretToken: string       // Security Token
}
```

---

## 💡 使用示例

### 示例1: 基础上传（推荐方式）

使用**上传地址和凭证**方式，这是官方推荐的方式。

```tsx
import { useAliyunUpload } from '@/hooks/useAliyunUpload'
import { Button, Progress, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

function BasicUpload() {
  const upload = useAliyunUpload({
    userId: '123456',
    authType: 'uploadAuth',
    
    onGetUploadAuth: async (uploadInfo) => {
      // 调用后端接口获取上传凭证
      const res = await fetch('/api/vod/create-upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadInfo.file.name,
          fileName: uploadInfo.file.name,
        }),
      })
      return res.json()
    },
    
    onRefreshUploadAuth: async (videoId) => {
      // 调用后端接口刷新凭证
      const res = await fetch('/api/vod/refresh-upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      })
      return res.json()
    },
  })

  return (
    <div>
      <Upload.Dragger
        accept="video/*"
        showUploadList={false}
        beforeUpload={(file) => {
          upload.addFile(file)
          return false
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽视频文件到此区域上传</p>
      </Upload.Dragger>

      {upload.status === 'uploading' && (
        <Progress percent={upload.progress} status="active" />
      )}

      <Button type="primary" onClick={upload.startUpload}>
        开始上传
      </Button>
    </div>
  )
}
```

### 示例2: STS Token 方式

适用于需要临时授权的场景。

```tsx
const upload = useAliyunUpload({
  userId: '123456',
  authType: 'stsToken',
  
  onGetSTSToken: async (uploadInfo) => {
    const res = await fetch('/api/vod/get-sts-token', {
      method: 'POST',
    })
    const data = await res.json()
    return {
      AccessKeyId: data.SecurityTokenInfo.AccessKeyId,
      AccessKeySecret: data.SecurityTokenInfo.AccessKeySecret,
      SecretToken: data.SecurityTokenInfo.SecretToken,
    }
  },
  
  onRefreshSTSToken: async () => {
    const res = await fetch('/api/vod/refresh-sts-token', {
      method: 'POST',
    })
    const data = await res.json()
    return {
      AccessKeyId: data.SecurityTokenInfo.AccessKeyId,
      AccessKeySecret: data.SecurityTokenInfo.AccessKeySecret,
      SecretToken: data.SecurityTokenInfo.SecretToken,
    }
  },
})

// 添加文件时可以传入额外的 userData
upload.addFile(file, {
  Title: '视频标题',
  Tags: '标签1,标签2',
  Description: '视频描述',
})
```

### 示例3: 多文件上传队列

```tsx
function MultiFileUpload() {
  const upload = useAliyunUpload({
    userId: '123456',
    authType: 'uploadAuth',
    // ... 配置省略
  })

  return (
    <div>
      {/* 支持多选 */}
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={(e) => {
          Array.from(e.target.files || []).forEach(file => {
            upload.addFile(file)
          })
        }}
      />

      {/* 显示队列 */}
      <ul>
        {upload.fileList.map((item, index) => (
          <li key={index}>
            {item.file.name}
            <button onClick={() => upload.deleteFile(index)}>删除</button>
            <button onClick={() => upload.cancelFile(index)}>取消</button>
            <button onClick={() => upload.resumeFile(index)}>恢复</button>
          </li>
        ))}
      </ul>

      {/* 批量操作 */}
      <button onClick={upload.startUpload}>开始上传全部</button>
      <button onClick={upload.stopUpload}>停止上传</button>
      <button onClick={upload.cleanList}>清空队列</button>
    </div>
  )
}
```

### 示例4: 上传加速

适用于大文件或跨区域上传。

```tsx
const upload = useAliyunUpload({
  userId: '123456',
  authType: 'uploadAuth',
  
  // 启用上传加速（需提前开通）
  enableAccelerate: true,
  accelerateDomain: 'https://vod-*******.oss-accelerate.aliyuncs.com',
  
  // ... 其他配置
})
```

### 示例5: 断点续传处理

```tsx
const upload = useAliyunUpload({
  userId: '123456',
  authType: 'uploadAuth',
  
  onGetUploadAuth: async (uploadInfo) => {
    // 检查是否是断点续传
    if (uploadInfo.videoId) {
      console.log('检测到断点续传')
      console.log('断点信息:', upload.getCheckpoint(uploadInfo.file))
      
      // 使用刷新接口
      const res = await fetch('/api/vod/refresh-upload-video', {
        method: 'POST',
        body: JSON.stringify({ videoId: uploadInfo.videoId }),
      })
      return res.json()
    } else {
      // 首次上传，使用创建接口
      const res = await fetch('/api/vod/create-upload-video', {
        method: 'POST',
        body: JSON.stringify({ title: uploadInfo.file.name }),
      })
      return res.json()
    }
  },
  
  // ... 其他配置
})
```

---

## ❓ 常见问题

### 1. 如何获取上传成功后的视频ID？

在 `onUploadSucceed` 回调中可以获取到 `videoId`：

```tsx
const upload = useAliyunUpload({
  // ... 配置
})

// 监听状态变化
useEffect(() => {
  if (upload.status === 'success' && upload.currentFile?.videoId) {
    console.log('视频ID:', upload.currentFile.videoId)
    // 可以调用后端接口获取播放地址
  }
}, [upload.status, upload.currentFile])
```

### 2. 如何限制文件大小和类型？

在添加文件前进行验证：

```tsx
const handleFileSelect = (file: File) => {
  // 验证文件类型
  if (!file.type.startsWith('video/')) {
    message.error('只能上传视频文件')
    return
  }

  // 验证文件大小（例如：最大 2GB）
  const maxSize = 2 * 1024 * 1024 * 1024
  if (file.size > maxSize) {
    message.error('文件大小不能超过 2GB')
    return
  }

  // 添加到上传队列
  upload.addFile(file)
}
```

### 3. 上传失败如何重试？

Hook 内部会自动重试（默认3次），如果还是失败，可以手动重新开始：

```tsx
{upload.status === 'error' && (
  <div>
    <p>上传失败: {upload.error}</p>
    <Button onClick={upload.startUpload}>重新上传</Button>
  </div>
)}
```

### 4. 如何实现上传前的自定义验证？

```tsx
const handleBeforeUpload = async (file: File) => {
  try {
    // 调用后端接口验证（例如：检查用户是否有权限、文件是否重复等）
    const res = await fetch('/api/vod/check-upload', {
      method: 'POST',
      body: JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
      }),
    })
    
    const data = await res.json()
    
    if (!data.canUpload) {
      message.error(data.reason)
      return false
    }
    
    // 验证通过，添加到上传队列
    upload.addFile(file)
    return true
  } catch (err) {
    message.error('验证失败')
    return false
  }
}
```

### 5. 如何显示自定义的上传进度？

```tsx
{upload.status === 'uploading' && (
  <div>
    <p>正在上传: {upload.currentFile?.file.name}</p>
    <Progress
      percent={upload.progress}
      status="active"
      format={(percent) => `${percent}%`}
    />
    <p>
      已上传: {((upload.currentFile?.file.size || 0) * upload.progress / 100 / 1024 / 1024).toFixed(2)} MB
      / 总大小: {((upload.currentFile?.file.size || 0) / 1024 / 1024).toFixed(2)} MB
    </p>
  </div>
)}
```

### 6. 后端接口如何实现？

#### 创建上传凭证接口

```typescript
// Node.js + Express 示例
import { Client } from '@alicloud/pop-core'

app.post('/api/vod/create-upload-video', async (req, res) => {
  const client = new Client({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    endpoint: 'https://vod.cn-shanghai.aliyuncs.com',
    apiVersion: '2017-03-21',
  })

  const result = await client.request('CreateUploadVideo', {
    Title: req.body.title,
    FileName: req.body.fileName,
  })

  res.json({
    UploadAuth: result.UploadAuth,
    UploadAddress: result.UploadAddress,
    VideoId: result.VideoId,
  })
})
```

#### 刷新上传凭证接口

```typescript
app.post('/api/vod/refresh-upload-video', async (req, res) => {
  const client = new Client({
    // ... 配置同上
  })

  const result = await client.request('RefreshUploadVideo', {
    VideoId: req.body.videoId,
  })

  res.json({
    UploadAuth: result.UploadAuth,
    UploadAddress: result.UploadAddress,
    VideoId: result.VideoId,
  })
})
```

---

## 🎯 最佳实践

### 1. 推荐使用上传地址和凭证方式

相比 STS Token 方式，上传地址和凭证方式更简单、更安全。

### 2. 合理设置上传参数

```tsx
const upload = useAliyunUpload({
  userId: '123456',
  authType: 'uploadAuth',
  
  // 大文件建议增大分片大小
  partSize: 5 * 1024 * 1024, // 5MB
  
  // 网络较好时可以增加并行数
  parallel: 10,
  
  // 网络不稳定时增加重试次数
  retryCount: 5,
  retryDuration: 3,
  
  // ... 其他配置
})
```

### 3. 添加加载状态提示

```tsx
{upload.status === 'idle' && <Spin tip="正在初始化上传器..." />}
{upload.status === 'uploading' && <Spin tip="正在上传..." />}
```

### 4. 使用 React.memo 优化性能

```tsx
const VideoUploadComponent = React.memo(() => {
  const upload = useAliyunUpload({
    // ... 配置
  })
  
  return <div>{/* UI */}</div>
})
```

### 5. 错误处理与用户提示

```tsx
useEffect(() => {
  if (upload.status === 'error') {
    Modal.error({
      title: '上传失败',
      content: upload.error,
      onOk: () => {
        // 清理或重试
        upload.cleanList()
      },
    })
  }
}, [upload.status, upload.error])
```

### 6. 离开页面前提醒

```tsx
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (upload.status === 'uploading') {
      e.preventDefault()
      e.returnValue = '正在上传中，确定要离开吗？'
      return e.returnValue
    }
  }

  window.addEventListener('beforeunload', handleBeforeUnload)
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
}, [upload.status])
```

---

## 📖 参考文档

- [阿里云视频点播官方文档](https://help.aliyun.com/zh/vod/developer-reference/upload-sdk-for-javascript)
- [JavaScript SDK 错误码](https://help.aliyun.com/zh/vod/developer-reference/client-error-codes)
- [视频点播 API 参考](https://help.aliyun.com/zh/vod/developer-reference/api-vod-2017-03-21-overview)

---

## 🔄 更新日志

### v1.0.0 (2026-02-09)

- ✅ 初始版本发布
- ✅ 支持上传地址和凭证方式
- ✅ 支持 STS Token 方式
- ✅ 支持断点续传
- ✅ 支持上传加速
- ✅ 完整的 TypeScript 类型定义
- ✅ 详细的使用文档和示例

---

## 📝 许可证

MIT License
