import { ItemWithIcon, Skeleton } from '@components'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { usernames, formatTime } from '@/util/functions'
import { useSession } from 'next-auth/react'
import useSelectConversation from '@/hooks/useSelectConversation'

export const ConversationList = () => {
	const { conversations, loading } = useContext(AppContext)
	const { data: userData } = useSession()

	const { onSelectConversation } = useSelectConversation()

	return (
		<div className='s-full overflow-auto flex flex-col gap-1'>
			{loading && <Skeleton count={5} className='p-3 h-full col overflow-hidden [&>*:nth-child(even)]:self-end [&>*:not(:first-child)]:mt-6 ' childrenClassName='w-full h-[40px] rounded' />}

			{conversations?.map((conversation) => {
				const { users, id, updatedAt, lastMessage } = conversation
				const hasSeenLatestMessage = users.find((user) => user.user.id === userData?.user.id)?.hasSeenLatestMessage
				return (
					<ItemWithIcon
						key={id}
						time={formatTime(updatedAt)}
						message={lastMessage?.body}
						id={id}
						name={usernames(users, userData?.user.id)}
						onClick={() => onSelectConversation(conversation, !!hasSeenLatestMessage)}
						hasUpdate={!hasSeenLatestMessage}
					/>
				)
			})}
		</div>
	)
}
