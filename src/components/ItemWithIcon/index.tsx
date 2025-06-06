import { ItemWithIconProps, UserIcon } from '@components'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { is } from '@/util/functions'

export const ItemWithIcon = ({ name = 'test user', message, time, onClick, id, hasUpdate }: ItemWithIconProps) => {
	const { conversationId } = useContext(AppContext)
	const selected = id === conversationId
	return (
		<div onClick={onClick} className={`w-full relative select-none flex px-6 py-3 rounded-xl gap-2 items-center ${id ? is(selected, 'bg-indigo-500', 'hover:bg-gray-300') : ''}`}>
			<UserIcon notification={hasUpdate} />
			<div id='content' className='col overflow-hidden w-full'>
				<div className='flex justify-between w-full items-center'>
					<p className={`text-base ${is(selected, 'text-gray-100', 'text-zinc-800')} font-medium overflow-hidden text-ellipsis w-full`}>{name}</p>
					<p className={`text-xs min-w-fit text-right absolute top-2 right-2 ${is(selected, 'text-gray-100', 'text-zinc-600')}`}>{time}</p>
				</div>
				<p className={`text-sm font-normal text-ellipsis whitespace-nowrap overflow-hidden ${is(selected, 'text-gray-200', 'text-zinc-600')}`}>{message}</p>
			</div>
		</div>
	)
}
