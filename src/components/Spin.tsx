import { useGlobalStore } from '@/store/global'
import { Spin } from 'antd'

const CustomSpin: React.FC = () => {
	const isShowLoading = useGlobalStore((state) => state.isShowLoading)

	return (
		<>
			<Spin spinning={isShowLoading} fullscreen />
		</>
	)
}

export default CustomSpin
