import { useLanguage } from '@/hooks/useLanguage'

export default function LanguageMenu() {
	interface Items {
		key: languageType
		label: string
	}

	const { language, setLanguage } = useLanguage()
	const items: Items[] = [
		{
			label: '简体中文',
			key: 'zh-CN',
		},
		{
			label: 'English',
			key: 'en-US',
		},
	]

	const onClick = ({ key }: Items) => {
		setLanguage(key)
	}

	return (
		<Dropdown
			menu={{
				items,
				onClick,
				selectable: true,
				defaultSelectedKeys: [language],
			}}
			arrow
			placement='bottom'
		>
			<div role='menuitem' tabIndex={-1}>
				<div className='i-mdi:google-translate w-1em h-1em'></div>
			</div>
		</Dropdown>
	)
}
