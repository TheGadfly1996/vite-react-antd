import { Table } from 'antd'
const { Column, ColumnGroup } = Table

export default function Menu() {
	const [data, setData] = useState([
		{
			name: '菜单管理',
			icon: '',
			key: '',
			createTime: '2024-08-01',
		},
		{
			name: '用户管理',
			icon: '',
			key: '',
			createTime: '2024-08-01',
		},
	])

	return (
		<div>
			<Button type='primary'>新增</Button>
			<Table sticky dataSource={data}>
				<Column title='名称' dataIndex='name' />
				<Column title='图标' dataIndex='icon' />
				<Column title='权限标识' dataIndex='key' />
				<Column title='创建时间' dataIndex='createTime' />
			</Table>
		</div>
	)
}
