import { UserIcon } from '@components'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { is } from '@/util/functions'

interface ItemWithIconProps {
	name?: string
	message?: string
	time?: string
	onClick?: () => void
	id: string
}

export const ItemWithIcon = ({ name = 'test user', message, time, onClick, id }: ItemWithIconProps) => {
	const { conversationId } = useContext(AppContext)

	return (
		<div onClick={onClick} className={`w-full flex p-3 gap-2 items-center ${is(id === conversationId, 'bg-gray-700', 'hover:bg-zinc-700')}`}>
			<UserIcon />
			<div id='content' className='col overflow-hidden w-full'>
				<div className='flex justify-between w-full items-center'>
					<p className='text-base font-normal text-zinc-300 overflow-hidden text-ellipsis w-3/4'>{name}</p>
					<p className='text-xs min-w-fit text-zinc-400 w-1/4 text-right'>{time}</p>
				</div>

				<p className='text-sm font-light text-zinc-400 text-ellipsis whitespace-nowrap overflow-hidden'>{message}</p>
			</div>
		</div>
	)
}
