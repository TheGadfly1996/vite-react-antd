interface Props {
	onIconChange: (params: string) => void
}
import { antdIconList } from '@/config/icons'

export default function AllIcons({ onIconChange }: Props) {
	return (
		<ul className='flex flex-wrap gap-10  w-250 h-250 overflow-y-scroll'>
			{antdIconList.map((item) => (
				<li
					onClick={() => {
						onIconChange(item)
					}}
					key={item}
					className={`${item} w-20 h-20 text-20 cursor-pointer hover:text-blue`}
				></li>
			))}
		</ul>
	)
}
