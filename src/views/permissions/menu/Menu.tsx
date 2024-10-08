import { Table, Input } from 'antd'
import menuCss from './menu.module.scss'
import { DownOutlined } from '@ant-design/icons'
import AntdIcons from '@/components/AntdIcons'

import { CreateMenus, GetMenus } from '@/axios/api/menu'

const { Column } = Table
const treeData = [
	// {
	// 	title: '系统管理',
	// 	value: '0-0',
	// 	children: [
	// 		{ title: '用户管理', value: '0-0-0', isLeaf: true },
	// 		{ title: '菜单管理', value: '0-0-1', isLeaf: true },
	// 	],
	// },
	// {
	// 	title: '系统测试',
	// 	value: '0-1',
	// 	children: [],
	// },
]
export default function Menu() {
	// 表格数据
	const [treeData, setTreeData] = useState([])
	const [tableData, setTableData] = useState([])
	const columns = [
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: '图标',
			dataIndex: 'icon',
			key: 'icon',
			align: 'center',
		},
		{
			title: '路由',
			dataIndex: 'route',
			key: 'route',
			align: 'center',
		},
		{
			title: '权限标识',
			dataIndex: 'permission',
			key: 'permission',
			align: 'center',
		},
		{
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			align: 'center',
		},
	]
	async function fetchMenus() {
		const { data } = await GetMenus()
		console.log(data)
		setTableData(data)
		setTreeData(data)
	}
	useEffect(() => {
		fetchMenus()
	}, [])

	// 弹窗标题
	const [title, setTitle] = useState('新增菜单')
	const [isShowModal, setIsShowModal] = useState(false)
	function handleAdd() {
		setIsShowModal(true)
	}

	// 表单数据
	const initialData = {
		type: '1',
		icon: '',
		name: '系统管理',
		menu_order: 0,
		route: '/system-manage',
		parent_id: '',
		permission: '',
	}

	const [form] = Form.useForm()
	const icon = Form.useWatch('icon', form)
	const parent_id = Form.useWatch('parent_id', form)
	const type = Form.useWatch('type', form)

	// 处理从子组件接收到的图标数据
	const [isShowIconPopover, setIsShowIconPopover] = useState(false)
	const handleChangeIcon = (icon: string) => {
		form.setFieldsValue({ icon })
		setIsShowIconPopover(false)
	}
	// 创建新菜单
	async function handleConfirm() {
		const values = form.getFieldsValue()
		const data = await CreateMenus(values)
		fetchMenus()
		setIsShowModal(false)
	}

	return (
		<div>
			<Button onClick={handleAdd} type='primary'>
				新增
			</Button>
			<Table columns={columns} sticky dataSource={tableData}>
				<Column title='名称' dataIndex='name' align='center' />
				<Column title='图标' dataIndex='icon' align='center' />
				<Column title='路由' dataIndex='route' align='center' />
				<Column title='权限标识' dataIndex='permission' align='center' />
				<Column title='创建时间' dataIndex='create_time' align='center' />
			</Table>
			<Modal centered title={title} open={isShowModal} onOk={handleConfirm} onCancel={() => setIsShowModal(false)}>
				<Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout='horizontal' initialValues={initialData} style={{ maxWidth: 600 }}>
					<Form.Item name='type' label='菜单类型'>
						<Radio.Group>
							<Radio.Button value='1'> 目录 </Radio.Button>
							<Radio.Button value='2'> 菜单 </Radio.Button>
							<Radio.Button value='3'> 按钮 </Radio.Button>
						</Radio.Group>
					</Form.Item>
					<Form.Item name='name' label='菜单名称'>
						<Input />
					</Form.Item>
					<Form.Item name='parent_id' label='上级菜单'>
						<TreeSelect fieldNames={{ label: 'name', value: 'id' }} placeholder='不填为主目录' value={parent_id} treeDefaultExpandAll treeData={treeData} />
					</Form.Item>
					<Form.Item name='route' label='路由地址'>
						<Input />
					</Form.Item>
					{type !== '1' && (
						<Form.Item name='permission' label='权限标识'>
							<Input />
						</Form.Item>
					)}

					<Form.Item label='菜单图标' name='icon'>
						<Popover
							open={isShowIconPopover}
							rootClassName='root'
							overlayClassName={menuCss.root}
							content={<AntdIcons onIconChange={handleChangeIcon} />}
							placement='bottom'
							trigger='click'
							onOpenChange={(isShow) => {
								setIsShowIconPopover(isShow)
							}}
						>
							<Input
								className='cursor-pointer'
								suffix={
									<DownOutlined
										className='text-#BFBFBF'
										onClick={() => {
											setIsShowIconPopover(true)
										}}
									/>
								}
								readOnly
								value={icon}
								prefix={<div className={`${icon} text-bluegray`}></div>}
								placeholder='请选择一个图标'
							/>
						</Popover>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
