import { InboxOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'

import type { UploadProps } from 'antd'
import { Button, Card, Form, Input, Modal, Select, Space, Table, Upload, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { loadJs } from '@/utils/dynamicLoadJs'

const { TextArea } = Input
const { Dragger } = Upload

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
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<ImageConfigRecord[]>([])

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
      title: '视频介绍',
      dataIndex: 'videoUrl',
      key: 'videoUrl',
      width: 120,
      render: (url: string) => (url ? '已上传' : '-'),
    },
    {
      title: '带底座大图',
      dataIndex: 'imageWithBase',
      key: 'imageWithBase',
      width: 120,
      render: (url: string) => (url ? '已上传' : '-'),
    },
    {
      title: '带底座缩略图',
      dataIndex: 'thumbnailWithBase',
      key: 'thumbnailWithBase',
      width: 140,
      render: (url: string) => (url ? '已上传' : '-'),
    },
    {
      title: '不带底座大图',
      dataIndex: 'imageWithoutBase',
      key: 'imageWithoutBase',
      width: 140,
      render: (url: string) => (url ? '已上传' : '-'),
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
          <Button type="link" size="small" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // Image upload props
  const imageUploadProps: UploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('只能上传图片文件!')
        return Upload.LIST_IGNORE
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB!')
        return Upload.LIST_IGNORE
      }
      return false
    },
    maxCount: 1,
  }

  // Video upload props
  const videoUploadProps: UploadProps = {
    beforeUpload: (file: File) => {
      const isVideo = file.type.startsWith('video/')
      if (!isVideo) {
        message.error('只能上传视频文件!')
        return Upload.LIST_IGNORE
      }
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        message.error('视频大小不能超过 50MB!')
        return Upload.LIST_IGNORE
      }
      return false
    },
    maxCount: 1,
  }

  // Handle search
  const handleSearch = async (values: any) => {
    setLoading(true)
    try {
      console.log('Search params:', values)
      // TODO: Replace with actual API call
      // const response = await dollApi.getImageConfigList(values)
      // setTableData(response.data)
      message.success('查询成功')
    } catch (error) {
      message.error('查询失败')
    } finally {
      setLoading(false)
    }
  }

  // Handle reset search
  const handleReset = () => {
    searchForm.resetFields()
    handleSearch({})
  }

  // Handle add/edit submit
  const createUploader = async () => {
    try {
      // 1. 加载阿里云 OSS SDK (从 node_modules)
      const OSS = await import('ali-oss/dist/aliyun-oss-sdk.min.js')
      window.OSS = OSS

      // 2. 动态加载阿里云上传 SDK (从 public 目录)
      await loadJs('/aliyun-upload/aliyun-upload-sdk-1.5.7.min.js')

      // 3. 从 window 对象获取上传 SDK (脚本加载后会挂载到全局)
      const AliyunUpload = (window as any).AliyunUpload
      if (!AliyunUpload) {
        throw new Error('阿里云上传 SDK 加载失败')
      }

      const uploader = new AliyunUpload.Vod({
        userId: '122',
        // 开始上传
        onUploadstarted(uploadInfo: any) {
          // 请求凭证
          console.log('开始上传:', uploadInfo)
        },
        // 文件上传成功
        onUploadSucceed(uploadInfo: any) {
          console.log('上传成功:', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed(uploadInfo: any, code: string, message: string) {
          console.error('上传失败:', uploadInfo, code, message)
        },
        // 文件上传进度
        onUploadProgress(uploadInfo: any, totalSize: number, progress: number) {
          console.log('上传进度:', progress)
        },
        // 上传凭证超时
        onUploadTokenExpired(uploadInfo: any) {
          console.warn('凭证超时:', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd(uploadInfo: any) {
          console.log('上传结束:', uploadInfo)
        },
      })
      console.log('uploader 初始化成功:', uploader)
      return uploader
    } catch (error) {
      console.error('创建 uploader 失败:', error)
      message.error('上传组件初始化失败')
      throw error
    }
  }
  createUploader().then((uploader) => {
    console.log('uploader', uploader)
  })

  const handleModalSubmit = async () => {
    try {
      const values = await modalForm.validateFields()
      console.log('Form values:', values)

      // TODO: Replace with actual API call
      // await dollApi.updateImageConfig(values)

      message.success('保存成功')
      setIsModalOpen(false)
      modalForm.resetFields()
      handleSearch(searchForm.getFieldsValue())
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // Handle edit
  const handleEdit = (record: ImageConfigRecord) => {
    modalForm.setFieldsValue(record)
    setIsModalOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // TODO: Replace with actual API call
          // await dollApi.deleteImageConfig(id)
          message.success('删除成功')
          handleSearch(searchForm.getFieldsValue())
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Search Card */}
        <Card className="border rounded-lg shadow-sm">
          <Form
            form={searchForm}
            onFinish={handleSearch}
            layout="inline"
            className="flex-wrap gap-4"
          >
            <Form.Item name="characterName" className="mb-4">
              <Select
                placeholder="角色名称"
                options={characterOptions}
                allowClear
                className="w-48 rounded-lg"
              />
            </Form.Item>
            <Form.Item className="mb-4">
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                  查询
                </Button>
                <Button onClick={handleReset} className="rounded-lg">
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Table Card */}
        <Card
          className="border border-gray-200 rounded-lg shadow-sm"
          title={<span className="text-lg text-gray-900 font-semibold">图片配置列表</span>}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              新增配置
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={<span className="text-lg font-semibold">图片配置</span>}
          open={isModalOpen}
          onOk={handleModalSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            modalForm.resetFields()
          }}
          width={800}
          okText="保存"
          cancelText="取消"
          className="rounded-lg"
        >
          <div className="py-4">
            <div className="mb-6 flex items-center gap-2 border border-red-200 rounded-lg bg-red-50 p-3">
              <span className="text-red-600">⚠</span>
              <span className="text-sm text-red-600">新增时如果已经配置过 则提醒会被覆盖</span>
            </div>

            <Form form={modalForm} layout="vertical" className="space-y-4">
              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">角色名称</span>}
                name="characterName"
                initialValue="bat-xiaoxin"
                rules={[{ required: true, message: '请选择角色名称' }]}
              >
                <Select
                  options={characterOptions}
                  placeholder="请选择角色"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-sm text-gray-700 font-medium">
                    角色简介 <span className="text-gray-400 font-normal">非必须</span>
                  </span>
                }
                name="characterDescription"
              >
                <TextArea rows={4} placeholder="请输入" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-sm text-gray-700 font-medium">
                    视频介绍 <span className="text-gray-400 font-normal">非必须</span>
                  </span>
                }
                name="videoUrl"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e
                  }
                  return e?.fileList
                }}
              >
                <Dragger {...videoUploadProps} className="border-gray-200 rounded-lg">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined className="text-blue-600" />
                  </p>
                  <p className="ant-upload-text text-gray-900">点击或拖拽视频文件到此区域</p>
                  <p className="ant-upload-hint text-gray-500">
                    支持 MP4, MOV 等格式，文件大小不超过 50MB
                  </p>
                </Dragger>
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

                <Form.Item
                  label={<span className="text-sm text-gray-700 font-medium">带底座缩略图</span>}
                  name="thumbnailWithBase"
                  rules={[{ required: true, message: '请上传带底座缩略图' }]}
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

                <Form.Item
                  label={<span className="text-sm text-gray-700 font-medium">不带底座大图</span>}
                  name="imageWithoutBase"
                  rules={[{ required: true, message: '请上传不带底座大图' }]}
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
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ImageConfig
