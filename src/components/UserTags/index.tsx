import { SearchedUser } from '@/graphql/types'
import { Close } from '@components'
import { useContext } from 'react'
import { StartConversationContext } from '../Context/StartConversationContext'

interface UserTagProps {
	user: SearchedUser
}

const UserTag = ({ user }: UserTagProps) => {
	const { removeUser } = useContext(StartConversationContext)

	return (
		<span key={user.id} className='py-1 px-2 rounded-sm bg-slate-700 flex items-center gap-2 h-8'>
			<span>{user.username}</span>
			<Close onClick={() => removeUser(user.id)} className='w-5 h-5 fill-white cursor-pointer' />
		</span>
	)
}

export const UserTags = () => {
	const { selectedUsers } = useContext(StartConversationContext)

	return selectedUsers.length ? (
		<div id='tags' className='flex flex-wrap gap-2 px-3 pb-0 max-h-[150px] overflow-auto mb-3'>
			{selectedUsers.map((user) => (
				<UserTag user={user} />
			))}
		</div>
	) : null
}
