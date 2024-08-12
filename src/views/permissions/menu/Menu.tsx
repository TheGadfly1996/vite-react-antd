import { Table, Input } from 'antd'
import AntdIcons from '@/components/AntdIcons'
import menuCss from './menu.module.scss'

const { Column } = Table
const { Search } = Input

export default function Menu() {
	const [data, setData] = useState([
		{
			name: '菜单管理',
			icon: '1',
			key: '1',
			createTime: '2024-08-01',
		},
		{
			name: '用户管理',
			icon: '2',
			key: '2',
			createTime: '2024-08-02',
		},
	])
	// 表单
	const [formData, setFormData] = useState({
		treeData: [
			{
				title: '系统管理',
				value: '0-0',
				children: [
					{ title: '用户管理', value: '0-0-0', isLeaf: true },
					{ title: '菜单管理', value: '0-0-1', isLeaf: true },
				],
			},
			{
				title: '系统测试',
				value: '0-1',
				children: [],
			},
		],
		parentDirectory: '',
		type: '',
		icon: '',
	})
	function onTreeChange(value: string) {
		console.log(value)
		setFormData({ ...formData, parentDirectory: value })
	}

	const [title, setTitle] = useState('新增菜单')
	const [isShowModal, setIsShowModal] = useState(false)
	function handleAdd() {
		setIsShowModal(true)
	}
	// 处理从子组件接收到的数据
	const [isShowIconPopover, setIsShowIconPopover] = useState(false)
	const handleChangeIcon = (childData: string) => {
		console.log(childData)
		setFormData({ ...formData, icon: childData })
		setIsShowIconPopover(false)
	}

	return (
		<div>
			<Button onClick={handleAdd} type='primary'>
				新增
			</Button>
			<Table sticky dataSource={data}>
				<Column title='名称' dataIndex='name' align='center' />
				<Column title='图标' dataIndex='icon' align='center' />
				<Column title='权限标识' dataIndex='key' align='center' />
				<Column title='创建时间' dataIndex='createTime' align='center' />
			</Table>
			<Modal centered title={title} open={isShowModal} onOk={() => setIsShowModal(false)} onCancel={() => setIsShowModal(false)}>
				<Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout='horizontal' style={{ maxWidth: 600 }}>
					<Form.Item label='菜单类型'>
						<Radio.Group
							onChange={(e) => {
								setFormData({ ...formData, type: e.target.value })
							}}
							defaultValue='1'
						>
							<Radio.Button value='1'> 目录 </Radio.Button>
							<Radio.Button value='2'> 菜单 </Radio.Button>
							<Radio.Button value='3'> 按钮 </Radio.Button>
						</Radio.Group>
					</Form.Item>

					<Form.Item label='上级菜单'>
						<TreeSelect value={formData.parentDirectory} treeDefaultExpandAll onChange={onTreeChange} treeData={formData.treeData} />
					</Form.Item>

					<Form.Item label='图标'>
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
							<Search readOnly prefix={<div className={`${formData.icon} text-bluegray`}></div>} value={formData.icon} placeholder='请输入图标名称' />
						</Popover>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
