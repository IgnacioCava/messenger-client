import DefaultUserIcon from '@assets/default-user.png'
import Image from 'next/image'
import { is } from '@/util/functions'

export const UserIcon = ({ right = false, notification }: { right?: boolean; notification?: boolean }) => {
	return (
		<div className={`min-h-[40px] min-w-[40px] relative ${is(right, 'order-last')}`}>
			<Image src={DefaultUserIcon} alt={'user icon'} className={`h-10 w-10 ${is(right, 'order-last')}`} />
			{notification && (
				<>
					<div className='min-h-[10px] min-w-[10px] rounded-[50%] absolute top-0 animate-ping border' />
					<div className='min-h-[10px] min-w-[10px] bg-sky-400 rounded-[50%] absolute top-0' />
				</>
			)}
		</div>
	)
}
