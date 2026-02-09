import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Modal, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'

interface ModelRecord {
  id: string
  seriesId: string
  seriesName: string
  productModel: string
  characterName: string
  createdAt: string
}

const ModelManage: React.FC = () => {
  const [searchForm] = Form.useForm()
  const [modalForm] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<ModelRecord[]>([])

  // Table columns
  const columns: ColumnsType<ModelRecord> = [
    {
      title: '系列ID',
      dataIndex: 'seriesId',
      key: 'seriesId',
      width: 150,
    },
    {
      title: '系列名称',
      dataIndex: 'seriesName',
      key: 'seriesName',
      width: 200,
    },
    {
      title: '产品型号',
      dataIndex: 'productModel',
      key: 'productModel',
      width: 200,
    },
    {
      title: '角色名称',
      dataIndex: 'characterName',
      key: 'characterName',
      width: 150,
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

  // Handle search
  const handleSearch = async (values: any) => {
    setLoading(true)
    try {
      console.log('Search params:', values)
      // TODO: Replace with actual API call
      // const response = await dollApi.getSeriesList(values)
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
  const handleModalSubmit = async () => {
    try {
      const values = await modalForm.validateFields()
      console.log('Form values:', values)

      // TODO: Replace with actual API call
      // await dollApi.createOrUpdateSeries(values)

      message.success('保存成功')
      setIsModalOpen(false)
      modalForm.resetFields()
      handleSearch(searchForm.getFieldsValue())
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // Handle edit
  const handleEdit = (record: ModelRecord) => {
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
          // await dollApi.deleteSeries(id)
          message.success('删除成功')
          handleSearch(searchForm.getFieldsValue())
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Search Card */}
        <Card className="border border-gray-200 rounded-lg shadow-sm">
          <Form
            form={searchForm}
            onFinish={handleSearch}
            layout="inline"
            className="flex-wrap gap-4"
          >
            <Form.Item name="seriesId" className="mb-4">
              <Input placeholder="系列ID" className="w-48 rounded-lg" />
            </Form.Item>
            <Form.Item name="seriesName" className="mb-4">
              <Input placeholder="系列名称" className="w-48 rounded-lg" />
            </Form.Item>
            <Form.Item name="productModel" className="mb-4">
              <Input placeholder="产品型号" className="w-48 rounded-lg" />
            </Form.Item>
            <Form.Item name="characterName" className="mb-4">
              <Input placeholder="角色名称" className="w-48 rounded-lg" />
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
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              新增型号
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1000 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={<span className="text-lg font-semibold">新增型号</span>}
          open={isModalOpen}
          onOk={handleModalSubmit}
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
            <div className="mb-6 flex items-center gap-2 border border-red-200 rounded-lg bg-red-50 p-3">
              <span className="text-red-600">⚠</span>
              <span className="text-sm text-red-600">新增时需要校验是否重复</span>
            </div>

            <Form form={modalForm} layout="vertical" className="space-y-4">
              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">系列ID</span>}
                name="seriesId"
                rules={[{ required: true, message: '请输入系列ID' }]}
              >
                <Input placeholder="请输入" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">系列名称</span>}
                name="seriesName"
                rules={[{ required: true, message: '请输入系列名称' }]}
              >
                <Input placeholder="请输入" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">产品型号</span>}
                name="productModel"
                rules={[{ required: true, message: '请输入产品型号' }]}
              >
                <Input placeholder="请输入" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm text-gray-700 font-medium">角色名称</span>}
                name="characterName"
                rules={[{ required: true, message: '请输入角色名称' }]}
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
