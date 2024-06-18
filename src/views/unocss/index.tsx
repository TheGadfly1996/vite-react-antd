import { useTranslation } from 'react-i18next'

export default function Unocss() {
	const { t } = useTranslation('global')

	return (
		<div className='w-full flex items-center justify-center gap-x-4 text-4xl p-2 mt-4 child-text-red'>
			<div className='i-mdi-cow text-20 text-orange-400' />
			<div className='i-mdi-snake text-20 text-orange-400' />
			{t('header')}
		</div>
	)
}
