import { ItemWithIcon } from '@components'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { usernames, formatTime } from '@/util/functions'
import { useSession } from 'next-auth/react'

export const ConversationList = () => {
	const { conversations, onSelectConversation } = useContext(AppContext)
	const { data: userData } = useSession({ required: true })

	return (
		<div className='s-full overflow-auto'>
			{conversations?.map((conversation) => {
				const { users, id, updatedAt } = conversation
				return <ItemWithIcon key={id} time={formatTime(updatedAt)} id={id} name={usernames(users, userData?.user.id)} onClick={() => onSelectConversation(conversation)} />
			})}
		</div>
	)
}
