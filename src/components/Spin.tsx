import { useSpinStore } from '@/store/spin'
import { Spin } from 'antd'

const CustomSpin: React.FC = () => {
	const isShowLoading = useSpinStore((state) => state.isShowLoading)

	return (
		<>
			<Spin spinning={isShowLoading} fullscreen />
		</>
	)
}

export default CustomSpin
