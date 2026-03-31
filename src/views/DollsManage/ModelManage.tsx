import { DollSeriesApi } from '@/axios/api/doll'
import { DollSeriesInfo, DollSeriesParams } from '@/axios/api/doll/types'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Modal, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useState } from 'react'

const ModelManage: React.FC = () => {
  const [searchForm] = Form.useForm()
  const [modalForm] = Form.useForm<DollSeriesInfo>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableData, setTableData] = useState<DollSeriesInfo[]>([])
  const [total, setTotal] = useState(0)
  const [modalType, setModalType] = useState<'create' | 'update'>('create')
  // Table columns
  const columns: ColumnsType<DollSeriesInfo> = [
    // {
    //   key: 'id',
    //   hidden: true,
    // },
    {
      title: '系列编号',
      dataIndex: 'series_id',
      key: 'series_id',
      width: 150,
    },
    {
      title: '系列名称',
      dataIndex: 'series_name',
      key: 'series_name',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      render: (text) => <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
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

  const handleSearch = async (values: DollSeriesParams) => {
    try {
      const params = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== ''))

      const { content, total: newTotal } = await DollSeriesApi.GetDollSeriesList(params)
      setTableData(content)
      setTotal(newTotal)
    } catch (error) {
      message.error('查询失败')
      console.error('查询失败:', error)
    }
  }

  useEffect(() => {
    DollSeriesApi.GetDollSeriesList({}).then(({ content, total: newTotal }) => {
      setTableData(content)
      setTotal(newTotal)
    })
  }, [])

  // Handle reset search
  const handleReset = () => {
    searchForm.resetFields()
    handleSearch({})
  }

  const modalMap = {
    create: { title: '新增型号' },
    update: { title: '编辑型号' },
  }

  const handleModalSubmit = async (type: keyof typeof modalMap) => {
    try {
      const values = await modalForm.validateFields()

      if (type === 'update') {
        await DollSeriesApi.UpdateDollSeries(values)
      } else {
        await DollSeriesApi.CreateDollSeries(values)
      }

      message.success(type === 'update' ? '更新成功' : '新增成功')
      setIsModalOpen(false)
      modalForm.resetFields()
      handleSearch(searchForm.getFieldsValue())
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  const handleEdit = (record: DollSeriesInfo) => {
    setModalType('update')
    modalForm.setFieldsValue(record)
    setIsModalOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    await DollSeriesApi.DeleteDollSeries(id)

    message.success('删除成功')
    handleSearch({})
  }

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
            <Form.Item name="series_id" className="mb-4">
              <Input placeholder="系列ID" className="w-48 rounded-lg" />
            </Form.Item>
            <Form.Item name="series_name" className="mb-4">
              <Input placeholder="系列名称" className="w-48 rounded-lg" />
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
          title={<span className="text-lg text-gray-900 font-semibold">型号列表</span>}
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
              新增型号
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            scroll={{ x: 1000 }}
            pagination={{
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (t) => `共 ${t} 条`,
            }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={<span className="text-lg font-semibold">{modalMap[modalType].title}</span>}
          open={isModalOpen}
          onOk={() => handleModalSubmit(modalType)}
          onCancel={() => {
            setIsModalOpen(false)
            modalForm.resetFields()
          }}
          width={600}
          okText="保存"
          cancelText="取消"
          className="rounded-lg"
        >
          <div className="py-4">
            <Form form={modalForm} layout="vertical" className="space-y-4">
              <Form.Item name="id" className="hidden">
                <Input />
              </Form.Item>
              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">系列编号</span>}
                name="series_id"
                rules={[{ required: true, message: '请输入系列编号' }]}
              >
                <Input placeholder="请输入" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">系列名称</span>}
                name="series_name"
                rules={[{ required: true, message: '请输入系列名称' }]}
              >
                <Input placeholder="请输入" className="rounded-lg" />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ModelManage
