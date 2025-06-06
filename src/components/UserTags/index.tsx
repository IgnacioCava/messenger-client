import { Close, UserTagProps } from '@components'
import { useContext } from 'react'
import { StartConversationContext } from '../../context/StartConversationContext'

const UserTag = ({ user }: UserTagProps) => {
	const { removeUser } = useContext(StartConversationContext)

	return (
		<span key={user.id} className='py-2 px-2 rounded bg-gray-300 text-black flex items-center gap-2 h-9'>
			<span>{user.username}</span>
			<Close onClick={() => removeUser(user.id)} className='w-5 h-5 fill-black cursor-pointer' />
		</span>
	)
}

export const UserTags = () => {
	const { selectedUsers } = useContext(StartConversationContext)

	return selectedUsers.length ? (
		<div id='tags' className='flex flex-wrap gap-2 px-3 pb-0 max-h-[150px] overflow-auto mb-3'>
			{selectedUsers.map((user) => (
				<UserTag key={user.id} user={user} />
			))}
		</div>
	) : null
}
