import { UserIcon } from '@components'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { is } from '@/util/functions'

interface ItemWithIconProps {
	name?: string
	message?: string
	time?: string
	onClick?: () => void
	id?: string
	hasUpdate?: boolean
}

export const ItemWithIcon = ({ name = 'test user', message, time, onClick, id, hasUpdate }: ItemWithIconProps) => {
	const { conversationId } = useContext(AppContext)

	return (
		<div onClick={onClick} className={`w-full relative select-none flex p-3 gap-2 items-center ${id ? is(id === conversationId, 'bg-gray-700', 'hover:bg-zinc-700') : ''}`}>
			<UserIcon notification={hasUpdate} />
			<div id='content' className='col overflow-hidden w-full'>
				<div className='flex justify-between w-full items-center'>
					<p className='text-base font-normal text-zinc-300 overflow-hidden text-ellipsis w-full'>{name}</p>
					<p className='text-xs min-w-fit text-zinc-400 text-right absolute top-1 right-1'>{time}</p>
				</div>
				<p className='text-sm font-light text-zinc-400 text-ellipsis whitespace-nowrap overflow-hidden'>{message}</p>
			</div>
		</div>
	)
}
