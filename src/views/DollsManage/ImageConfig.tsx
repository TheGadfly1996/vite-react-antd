/**
 * ImageConfig - 图片配置管理页面
 * 支持视频上传、图片上传、预览等功能
 */

import VideoUpload from '@/components/VideoUpload'
import { useAliyunUpload } from '@/hooks/useAliyunUpload'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, Card, Form, Input, Modal, Select, Space, Table, Upload, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

const { TextArea } = Input

interface ImageConfigRecord {
  id: string
  characterName: string
  characterDescription?: string
  videoUrl?: string
  imageWithBase?: string
  thumbnailWithBase?: string
  imageWithoutBase?: string
  createdAt: string
}

const ImageConfig: React.FC = () => {
  const [searchForm] = Form.useForm()
  const [modalForm] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableData] = useState<ImageConfigRecord[]>([])
  const [editingRecord, setEditingRecord] = useState<ImageConfigRecord | null>(null)
  const [uploadedVideoId, setUploadedVideoId] = useState<string>('')

  // 🎉 使用 useAliyunUpload Hook（视频凭证接口已在 Hook 内部统一配置）
  const videoUpload = useAliyunUpload({
    userId: '122',
    authType: 'uploadAuth',
  })

  // 监听上传状态变化
  useEffect(() => {
    // 上传成功后保存 VideoId
    if (videoUpload.status === 'success' && videoUpload.currentFile?.videoId) {
      setUploadedVideoId(videoUpload.currentFile.videoId)
    }
  }, [videoUpload.status, videoUpload.currentFile])

  // 派生的 loading 状态
  const isUploading = videoUpload.status === 'uploading'

  // Mock character options
  const characterOptions = [
    { label: '蝙蝠小新', value: 'bat-xiaoxin' },
    { label: '超级英雄', value: 'superhero' },
    { label: '可爱兔子', value: 'cute-rabbit' },
  ]

  // Table columns
  const columns: ColumnsType<ImageConfigRecord> = [
    {
      title: '角色名称',
      dataIndex: 'characterName',
      key: 'characterName',
      width: 150,
    },
    {
      title: '角色简介',
      dataIndex: 'characterDescription',
      key: 'characterDescription',
      width: 250,
      ellipsis: true,
    },
    {
      title: '视频地址',
      dataIndex: 'videoUrl',
      key: 'videoUrl',
      width: 200,
      ellipsis: true,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: '带底图',
      dataIndex: 'imageWithBase',
      key: 'imageWithBase',
      width: 100,
      render: (url: string) =>
        url && <img src={url} alt="带底图" style={{ width: 50, height: 50 }} />,
    },
    {
      title: '缩略图',
      dataIndex: 'thumbnailWithBase',
      key: 'thumbnailWithBase',
      width: 100,
      render: (url: string) =>
        url && <img src={url} alt="缩略图" style={{ width: 50, height: 50 }} />,
    },
    {
      title: '不带底图',
      dataIndex: 'imageWithoutBase',
      key: 'imageWithoutBase',
      width: 100,
      render: (url: string) =>
        url && <img src={url} alt="不带底图" style={{ width: 50, height: 50 }} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // Handle search
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    // eslint-disable-next-line no-console
    console.log('搜索条件:', values)
    // TODO: 调用接口搜索
  }

  // Handle reset
  const handleReset = () => {
    searchForm.resetFields()
  }

  // Handle add
  const handleAdd = () => {
    setEditingRecord(null)
    modalForm.resetFields()
    setIsModalOpen(true)
  }

  // Handle edit
  const handleEdit = (record: ImageConfigRecord) => {
    setEditingRecord(record)
    modalForm.setFieldsValue(record)
    setIsModalOpen(true)
  }

  // Handle delete
  const handleDelete = (record: ImageConfigRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除"${record.characterName}"吗？`,
      onOk: () => {
        // eslint-disable-next-line no-console
        console.log('删除:', record)
        message.success('删除成功')
        // TODO: 调用接口删除
      },
    })
  }

  // Handle modal submit
  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields()

      // 检查视频上传状态
      if (videoUpload.fileList.length > 0 && videoUpload.status !== 'success') {
        message.warning('请等待视频上传完成')
        return
      }

      // 构建提交数据
      const submitData = {
        ...values,
        videoId: uploadedVideoId,
      }

      // eslint-disable-next-line no-console
      console.log('最终提交数据:', submitData)

      // TODO: 调用接口保存数据
      // await saveImageConfig(submitData)

      message.success(editingRecord ? '编辑成功' : '添加成功')
      setIsModalOpen(false)

      // 重置状态
      videoUpload.cleanList()
      setUploadedVideoId('')
      modalForm.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // Handle modal cancel
  const handleModalCancel = () => {
    // 如果正在上传，先停止上传
    if (videoUpload.status === 'uploading') {
      Modal.confirm({
        title: '确认取消',
        content: '视频正在上传中，确定要取消吗？',
        onOk: () => {
          videoUpload.stopUpload()
          videoUpload.cleanList()
          setIsModalOpen(false)
          setUploadedVideoId('')
          modalForm.resetFields()
        },
      })
    } else {
      videoUpload.cleanList()
      setIsModalOpen(false)
      setUploadedVideoId('')
      modalForm.resetFields()
    }
  }

  // 视频上传成功回调
  const handleVideoUploadSuccess = (videoId: string, videoUrl?: string) => {
    // eslint-disable-next-line no-console
    console.log('视频上传成功:', { videoId, videoUrl })
    setUploadedVideoId(videoId)
    // 可以将 videoId 设置到表单中
    modalForm.setFieldsValue({ videoId })
  }

  // 视频上传失败回调
  const handleVideoUploadError = (error: string) => {
    console.error('视频上传失败:', error)
  }

  // 图片上传配置（保持原有逻辑）
  const imageUploadProps: UploadProps = {
    accept: 'image/*',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('只能上传图片文件')
        return Upload.LIST_IGNORE
      }
      // TODO: 实现图片上传逻辑
      return false
    },
  }

  return (
    <div style={{ padding: 24 }}>
      <Card title="图片配置管理">
        {/* 搜索区域 */}
        <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="characterName" label="角色名称">
            <Input placeholder="请输入角色名称" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          loading={isUploading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑配置' : '新增配置'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        confirmLoading={isUploading}
        maskClosable={false}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item
            name="characterName"
            label="角色名称"
            rules={[{ required: true, message: '请选择角色名称' }]}
          >
            <Select placeholder="请选择角色" options={characterOptions} />
          </Form.Item>

          <Form.Item name="characterDescription" label="角色简介">
            <TextArea rows={3} placeholder="请输入角色简介" maxLength={200} showCount />
          </Form.Item>

          <Form.Item label="视频上传">
            <VideoUpload
              uploadInstance={videoUpload}
              accept="video/*"
              maxSize={2 * 1024 * 1024 * 1024}
              disabled={isUploading}
              onSuccess={handleVideoUploadSuccess}
              onError={handleVideoUploadError}
              tipText="支持 MP4、AVI、MOV 等格式，单个文件最大 2GB"
            />
          </Form.Item>
          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              label={<span className="text-sm text-gray-700 font-medium">带底座大图</span>}
              name="imageWithBase"
              rules={[{ required: true, message: '请上传带底座大图' }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e
                }
                return e?.fileList
              }}
            >
              <Upload {...imageUploadProps} listType="picture-card" className="rounded-lg">
                <div className="flex flex-col items-center">
                  <PlusOutlined className="text-gray-400" />
                  <div className="mt-2 text-sm text-gray-600">上传</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item label="缩略图上传">
              <Upload {...imageUploadProps} listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item label="不带底图上传">
              <Upload {...imageUploadProps} listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default ImageConfig
