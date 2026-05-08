import { uploadImage } from '@/axios/api/common'
import { DollApi, DollSeriesApi } from '@/axios/api/doll'
import type { DollInfo, DollSeriesInfo, DollUpdateParams } from '@/axios/api/doll/types'
import VideoUpload from '@/components/VideoUpload'
import { useAliyunUpload } from '@/hooks/useAliyunUpload'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Upload,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

type DollRecord = DollInfo & { id: string; create_time: string }

const modalMap = {
  create: { title: '新增玩偶' },
  update: { title: '编辑玩偶' },
}

const DollManage: React.FC = () => {
  const [searchForm] = Form.useForm()
  const [modalForm] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'update'>('create')
  const [tableData, setTableData] = useState<DollRecord[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [seriesOptions, setSeriesOptions] = useState<DollSeriesInfo[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  // 视频上传（接口待接入，UI 已就绪）
  const videoUpload = useAliyunUpload({ userId: '', authType: 'uploadAuth' })
  const isVideoUploading = videoUpload.status === 'uploading'

  // 图片上传配置
  const imageUploadProps: UploadProps = {
    accept: 'image/*',
    listType: 'picture-card',
    maxCount: 1,
    showUploadList: true,
    capture: undefined,
    beforeUpload: (file) => {
      if (!file.type.startsWith('image/')) {
        message.error('只能上传图片文件')
        return Upload.LIST_IGNORE
      }
      return true
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      const formData = new FormData()
      formData.append('doll_image', file as File)
      try {
        const res = await uploadImage(formData)
        onSuccess?.(res)
      } catch (error) {
        onError?.(error as Error)
        message.error('图片上传失败')
      }
    },
  }

  const fetchSeriesList = async () => {
    try {
      const { content } = await DollSeriesApi.GetDollSeriesList({})
      setSeriesOptions(content)
    } catch (error) {
      console.error('获取系列列表失败:', error)
    }
  }

  const fetchDolls = async (extraParams: Record<string, string> = {}) => {
    setLoading(true)
    try {
      const { content, total: newTotal } = await DollApi.GetDollList({
        page: String(pagination.page),
        limit: String(pagination.limit),
        ...extraParams,
      })
      setTableData(content as DollRecord[])
      setTotal(newTotal)
    } catch (error) {
      message.error('查询失败')
      console.error('查询失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSeriesList()
    DollApi.GetDollList({ page: '1', limit: '10' }).then(({ content, total: newTotal }) => {
      setTableData(content as DollRecord[])
      setTotal(newTotal)
    })
  }, [])

  const handleSearch = (values: { series_id?: string; doll_name?: string }) => {
    const params = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined)
    ) as Record<string, string>
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchDolls({ ...params, page: '1', limit: String(pagination.limit) })
  }

  const handleReset = () => {
    searchForm.resetFields()
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchDolls({ page: '1', limit: String(pagination.limit) })
  }

  const handleSeriesChange = (value: string) => {
    const series = seriesOptions.find((s) => s.series_id === value)
    if (series) {
      modalForm.setFieldsValue({ series_name: series.series_name })
    }
  }

  const resetModalState = () => {
    videoUpload.cleanList()
    modalForm.resetFields()
  }

  const handleVideoUploadSuccess = (videoId: string) => {
    // 视频上传成功后将 videoId 写入隐藏字段，接口接入后可传给后端
    modalForm.setFieldsValue({ videoId })
    console.warn('视频上传成功，videoId:', videoId)
  }

  const handleVideoUploadError = (error: string) => {
    console.error('视频上传失败:', error)
  }

  const handleModalSubmit = async () => {
    try {
      if (videoUpload.fileList.length > 0 && videoUpload.status === 'uploading') {
        message.warning('请等待视频上传完成')
        return
      }

      const values = await modalForm.validateFields()
      // launch_time 为必填，validateFields 保证此处一定有值
      const launchTime = dayjs(values.launch_time).format('YYYY-MM-DD')

      const imageFileList: UploadFile[] = values.doll_image ?? []
      if (imageFileList.some((f) => f.status === 'uploading')) {
        message.warning('请等待图片上传完成')
        return
      }
      // 新上传：取服务端返回的 resource_id；编辑回填场景：取已有的 doll_image 值
      const uploadedFile = imageFileList[0]
      type ImageUploadRes = { resource_id?: string; url?: string }
      const uploadRes = uploadedFile?.response as ImageUploadRes | undefined
      const dollImage = uploadRes?.resource_id ?? uploadedFile?.url ?? ''

      if (modalType === 'update') {
        const params: DollUpdateParams = {
          id: values.id,
          doll_id: values.doll_id,
          doll_name: values.doll_name,
          series_id: values.series_id,
          series_name: values.series_name,
          description: values.description,
          doll_image: dollImage,
          launch_time: launchTime,
        }
        await DollApi.UpdateDoll(params)
      } else {
        const params: DollInfo = {
          doll_id: values.doll_id,
          doll_name: values.doll_name,
          series_id: values.series_id,
          series_name: values.series_name,
          description: values.description ?? '',
          doll_image: dollImage,
          launch_time: launchTime,
        }
        await DollApi.CreateDoll(params)
      }

      message.success(modalType === 'update' ? '更新成功' : '新增成功')
      setIsModalOpen(false)
      resetModalState()
      fetchDolls(
        Object.fromEntries(
          Object.entries(searchForm.getFieldsValue()).filter(([, v]) => v !== '' && v !== undefined)
        ) as Record<string, string>
      )
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  const handleModalCancel = () => {
    if (isVideoUploading) {
      Modal.confirm({
        title: '确认取消',
        content: '视频正在上传中，确定要取消吗？',
        onOk: () => {
          videoUpload.stopUpload()
          setIsModalOpen(false)
          resetModalState()
        },
      })
    } else {
      setIsModalOpen(false)
      resetModalState()
    }
  }

  const handleEdit = (record: DollRecord) => {
    setModalType('update')
    const imageFileList: UploadFile[] = record.doll_image
      ? [{ uid: '-1', name: 'doll_image', status: 'done', url: record.doll_image }]
      : []
    modalForm.setFieldsValue({
      ...record,
      launch_time: record.launch_time ? dayjs(record.launch_time) : undefined,
      doll_image: imageFileList,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string, dollName: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除玩偶「${dollName}」吗？`,
      okType: 'danger',
      onOk: async () => {
        try {
          await DollApi.DeleteDoll(id)
          message.success('删除成功')
          fetchDolls(
            Object.fromEntries(
              Object.entries(searchForm.getFieldsValue()).filter(
                ([, v]) => v !== '' && v !== undefined
              )
            ) as Record<string, string>
          )
        } catch (error) {
          message.error('删除失败')
          console.error('删除失败:', error)
        }
      },
    })
  }

  const columns: ColumnsType<DollRecord> = [
    {
      title: '玩偶编号',
      dataIndex: 'doll_id',
      key: 'doll_id',
      width: 140,
    },
    {
      title: '玩偶名称',
      dataIndex: 'doll_name',
      key: 'doll_name',
      width: 140,
    },
    {
      title: '所属系列',
      key: 'series',
      width: 200,
      render: (_, record) => (
        <span>
          {record.series_name}
          <span className="ml-1 text-xs text-gray-400">({record.series_id})</span>
        </span>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 220,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '玩偶图片',
      dataIndex: 'doll_image',
      key: 'doll_image',
      width: 100,
      render: (url: string) =>
        url ? (
          <Image src={url} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          '-'
        ),
    },
    {
      title: '上市时间',
      dataIndex: 'launch_time',
      key: 'launch_time',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      render: (text: string) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record.id, record.doll_name)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const seriesSelectOptions = seriesOptions.map((s) => ({
    label: `${s.series_name}（${s.series_id}）`,
    value: s.series_id,
  }))

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto space-y-4">
        {/* Search Card */}
        <Card className="border border-gray-200 rounded-lg shadow-sm">
          <Form
            form={searchForm}
            onFinish={handleSearch}
            layout="inline"
            className="flex-wrap gap-4"
          >
            <Form.Item name="doll_name" className="mb-4">
              <Input placeholder="玩偶名称" style={{ width: 180 }} allowClear />
            </Form.Item>
            <Form.Item name="series_id" className="mb-4">
              <Select
                placeholder="所属系列"
                allowClear
                style={{ width: 220 }}
                options={seriesSelectOptions}
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
          title={<span className="text-lg text-gray-900 font-semibold">玩偶列表</span>}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setModalType('create')
                modalForm.resetFields()
                setIsModalOpen(true)
              }}
              className="rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              新增玩偶
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1300 }}
            pagination={{
              total,
              current: pagination.page,
              pageSize: pagination.limit,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (t) => `共 ${t} 条`,
              onChange: (page, limit) => {
                setPagination({ page, limit })
                fetchDolls({
                  ...Object.fromEntries(
                    Object.entries(searchForm.getFieldsValue()).filter(
                      ([, v]) => v !== '' && v !== undefined
                    )
                  ),
                  page: String(page),
                  limit: String(limit),
                } as Record<string, string>)
              },
            }}
          />
        </Card>

        {/* Add / Edit Modal */}
        <Modal
          title={<span className="text-lg font-semibold">{modalMap[modalType].title}</span>}
          open={isModalOpen}
          onOk={handleModalSubmit}
          onCancel={handleModalCancel}
          width={640}
          okText="保存"
          cancelText="取消"
          maskClosable={false}
          confirmLoading={isVideoUploading}
          className="rounded-lg"
        >
          <div className="py-4">
            <Form form={modalForm} layout="vertical" className="space-y-4">
              {/* Hidden fields */}
              <Form.Item name="id" className="hidden">
                <Input />
              </Form.Item>
              <Form.Item name="series_name" className="hidden">
                <Input />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">玩偶编号</span>}
                name="doll_id"
                rules={[{ required: true, message: '请输入玩偶编号' }]}
              >
                <Input placeholder="请输入" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">玩偶名称</span>}
                name="doll_name"
                rules={[{ required: true, message: '请输入玩偶名称' }]}
              >
                <Input placeholder="请输入" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">所属系列</span>}
                name="series_id"
                rules={[{ required: true, message: '请选择所属系列' }]}
              >
                <Select
                  placeholder="请选择系列"
                  onChange={handleSeriesChange}
                  options={seriesSelectOptions}
                  showSearch
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">描述</span>}
                name="description"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="请输入描述"
                  maxLength={200}
                  showCount
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">玩偶图片</span>}
                name="doll_image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[
                  {
                    required: true,
                    validator: (_, fileList: UploadFile[] = []) => {
                      const valid = fileList.some(
                        (f) => f.status === 'done' || f.status === undefined
                      )
                      return valid ? Promise.resolve() : Promise.reject('请上传玩偶图片')
                    },
                  },
                ]}
              >
                <Upload {...imageUploadProps}>
                  <div className="flex flex-col items-center justify-center">
                    <PlusOutlined className="text-gray-400" />
                    <div className="mt-1 text-sm text-gray-500">上传</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">上市时间</span>}
                name="launch_time"
                rules={[{ required: true, message: '请选择上市时间' }]}
              >
                <DatePicker className="w-full rounded-lg" placeholder="请选择上市时间" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">视频上传</span>}
              >
                <VideoUpload
                  uploadInstance={videoUpload}
                  accept="video/*"
                  maxSize={2 * 1024 * 1024 * 1024}
                  disabled={isVideoUploading}
                  onSuccess={handleVideoUploadSuccess}
                  onError={handleVideoUploadError}
                  tipText="支持 MP4、AVI、MOV 等格式，单个文件最大 2GB（上传接口待接入）"
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default DollManage
