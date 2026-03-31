import type { UseAliyunUploadReturn } from '@/hooks/useAliyunUpload'
import type { UploadFile, UploadProps } from 'antd'
import { InboxOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Button, message, Modal, Space, Upload } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'

const { Dragger } = Upload

interface VideoUploadProps {
  uploadInstance: UseAliyunUploadReturn
  accept?: string
  maxSize?: number
  disabled?: boolean
  onSuccess?: (videoId: string, videoUrl?: string) => void
  onError?: (error: string) => void
  tipText?: string
  maxCount?: number
}

/**
 * 视频上传组件
 * 基于 useAliyunUpload Hook 和 Ant Design Upload 组件
 * 使用官方组件展示上传进度和已上传的文件列表
 */
export const VideoUpload: React.FC<VideoUploadProps> = ({
  uploadInstance,
  accept = 'video/*',
  maxSize = 500 * 1024 * 1024, // 500MB
  disabled = false,
  onSuccess,
  onError,
  tipText = '支持 MP4、AVI、MOV 等格式，单个文件最大 500MB',
  maxCount = 5,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  // 稳定的回调函数
  const handleSuccess = useCallback(
    (videoId: string, videoUrl?: string) => {
      message.success('视频上传成功！')
      onSuccess?.(videoId, videoUrl)
    },
    [onSuccess]
  )

  const handleError = useCallback(
    (error: string) => {
      message.error(`上传失败: ${error}`)
      onError?.(error)
    },
    [onError]
  )

  // 同步 uploadInstance 状态到 fileList
  useEffect(() => {
    const newFileList: UploadFile[] = uploadInstance.fileList.map((item, index) => {
      let status: UploadFile['status'] = 'done'
      let percent = 0

      if (uploadInstance.status === 'uploading' && uploadInstance.currentFile === item) {
        status = 'uploading'
        percent = uploadInstance.progress
      } else if (uploadInstance.status === 'success' && uploadInstance.currentFile === item) {
        status = 'done'
        percent = 100
      } else if (uploadInstance.status === 'error' && uploadInstance.currentFile === item) {
        status = 'error'
        percent = uploadInstance.progress
      } else if (uploadInstance.status === 'ready') {
        status = 'done'
        percent = 0
      }

      return {
        uid: `${index}`,
        name: item.file.name,
        status,
        percent,
        size: item.file.size,
        type: item.file.type,
        url:
          uploadInstance.status === 'success' && uploadInstance.currentFile === item
            ? uploadInstance.currentFile.object
            : undefined,
        thumbUrl: item.file.type.startsWith('video/')
          ? URL.createObjectURL(item.file)
          : undefined,
      }
    })

    setFileList(newFileList)
  }, [
    uploadInstance.fileList,
    uploadInstance.status,
    uploadInstance.progress,
    uploadInstance.currentFile,
  ])

  // 监听上传成功和失败
  useEffect(() => {
    if (uploadInstance.status === 'success' && uploadInstance.currentFile) {
      handleSuccess(uploadInstance.currentFile.videoId || '', uploadInstance.currentFile.object)
    }

    if (uploadInstance.status === 'error') {
      handleError(uploadInstance.error || '未知错误')
    }
  }, [
    uploadInstance.status,
    uploadInstance.currentFile,
    uploadInstance.error,
    handleSuccess,
    handleError,
  ])

  // 处理文件选择前的验证
  const beforeUpload = (file: File) => {
    // 验证文件类型
    const isVideo = file.type.startsWith('video/')
    if (!isVideo) {
      message.error('只能上传视频文件')
      return Upload.LIST_IGNORE
    }

    // 验证文件大小
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0)
      message.error(`文件大小不能超过 ${maxSizeMB}MB`)
      return Upload.LIST_IGNORE
    }

    // 添加到上传队列
    uploadInstance.addFile(file, {
      Title: file.name,
      Description: '视频上传',
    })

    // 阻止自动上传
    return false
  }

  // 处理预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.thumbUrl) {
      return
    }

    setPreviewUrl(file.url || file.thumbUrl || '')
    setPreviewTitle(file.name || '')
    setPreviewVisible(true)
  }

  // 处理删除
  const handleRemove = (file: UploadFile) => {
    return new Promise<boolean>((resolve) => {
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除 ${file.name} 吗？`,
        onOk: () => {
          const index = fileList.findIndex((item) => item.uid === file.uid)
          if (index !== -1) {
            uploadInstance.deleteFile(index)
          }
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        },
      })
    })
  }

  // 处理下载
  const handleDownload = (file: UploadFile) => {
    if (file.url) {
      window.open(file.url, '_blank')
    }
  }

  // 自定义上传列表项渲染
  const itemRender: UploadProps['itemRender'] = (originNode, file, _fileList, actions) => {
    const { download, preview, remove } = actions

    return (
      <div className="custom-upload-item">
        <div className="upload-item-info">
          <PlayCircleOutlined className="video-icon" />
          <div className="file-details">
            <div className="file-name" title={file.name}>
              {file.name}
            </div>
            <div className="file-meta">
              {file.size && `${(file.size / 1024 / 1024).toFixed(2)} MB`}
              {file.status === 'done' && uploadInstance.currentFile?.videoId && (
                <span style={{ marginLeft: 8 }}>VideoId: {uploadInstance.currentFile.videoId}</span>
              )}
            </div>
          </div>
        </div>
        <div className="upload-item-actions">
          <Space>
            {file.status === 'done' && (
              <>
                <Button
                  type="link"
                  size="small"
                  onClick={() => preview()}
                  icon={<PlayCircleOutlined />}
                >
                  预览
                </Button>
                {file.url && (
                  <Button type="link" size="small" onClick={() => download()}>
                    下载
                  </Button>
                )}
              </>
            )}
            {file.status !== 'uploading' && (
              <Button type="link" size="small" danger onClick={() => remove()}>
                删除
              </Button>
            )}
            {file.status === 'uploading' && (
              <Button
                type="link"
                size="small"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: '确认停止',
                    content: '确定要停止上传吗？',
                    onOk: () => {
                      uploadInstance.stopUpload()
                      message.info('已停止上传')
                    },
                  })
                }}
              >
                停止
              </Button>
            )}
          </Space>
        </div>
        {originNode}
      </div>
    )
  }

  // 操作按钮
  const uploadButtons = (
    <div style={{ marginTop: fileList.length > 0 ? 16 : 0 }}>
      <Space style={{ width: '100%' }}>
        {uploadInstance.status !== 'uploading' &&
          fileList.length > 0 &&
          fileList.some((f) => f.status !== 'done') && (
            <Button
              type="primary"
              onClick={() => uploadInstance.startUpload()}
              disabled={disabled}
              block
            >
              开始上传
            </Button>
          )}
        {uploadInstance.status === 'error' && (
          <Button type="primary" onClick={() => uploadInstance.startUpload()} block>
            重新上传
          </Button>
        )}
      </Space>
    </div>
  )

  return (
    <div className="video-upload-container">
      <Dragger
        accept={accept}
        fileList={fileList}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onRemove={handleRemove}
        onDownload={handleDownload}
        itemRender={itemRender}
        disabled={disabled || uploadInstance.status === 'uploading'}
        maxCount={maxCount}
        multiple
        capture={undefined}
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: true,
          showDownloadIcon: true,
        }}
        progress={{
          strokeColor: {
            '0%': '#108ee9',
            '100%': '#87d068',
          },
          strokeWidth: 3,
          format: (percent) => `${percent?.toFixed(2)}%`,
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
        </p>
        <p className="ant-upload-text" style={{ fontSize: 16, marginTop: 16 }}>
          点击或拖拽视频文件到此区域上传
        </p>
        <p className="ant-upload-hint" style={{ color: '#999', marginTop: 8 }}>
          {tipText}
        </p>
      </Dragger>

      {uploadButtons}

      {/* 视频预览 Modal */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        centered
        styles={{ body: { padding: 0 } }}
      >
        <video
          ref={videoRef}
          src={previewUrl}
          controls
          style={{
            width: '100%',
            maxHeight: '70vh',
            backgroundColor: '#000',
          }}
          autoPlay
        />
      </Modal>

      <style>
        {`
          .video-upload-container .ant-upload-drag {
            border: 2px dashed #d9d9d9;
            border-radius: 8px;
            transition: all 0.3s;
          }
          
          .video-upload-container .ant-upload-drag:hover {
            border-color: #1890ff;
          }
          
          .video-upload-container .ant-upload-drag.ant-upload-drag-hover {
            border-color: #40a9ff;
            background-color: #f0f8ff;
          }

          .custom-upload-item {
            position: relative;
            padding: 12px 16px;
            background: #fafafa;
            border-radius: 8px;
            margin-bottom: 8px;
          }

          .custom-upload-item .upload-item-info {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .custom-upload-item .video-icon {
            font-size: 32px;
            color: #1890ff;
          }

          .custom-upload-item .file-details {
            flex: 1;
            overflow: hidden;
          }

          .custom-upload-item .file-name {
            font-size: 14px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 4px;
          }

          .custom-upload-item .file-meta {
            font-size: 12px;
            color: #999;
          }

          .custom-upload-item .upload-item-actions {
            position: absolute;
            top: 12px;
            right: 16px;
          }

          .video-upload-container .ant-upload-list-item {
            display: none;
          }

          .video-upload-container .ant-progress {
            margin-top: 8px;
          }
        `}
      </style>
    </div>
  )
}

export default VideoUpload
