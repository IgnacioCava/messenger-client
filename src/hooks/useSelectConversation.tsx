import { AppContext } from '@/context/AppContext'
import ConversationOperations from '@/graphql/operations/conversation'
import { Conversation, MutationMarkAsReadArgs } from '@/graphql/types'
import updateMessageReadStatus from '@/graphql/util/updateMessageReadStatus'
import { OpReturnType } from '@/util/utilityTypes'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { useConversationQuery } from './useConversationQuery'

const useSelectConversation = () => {
	const { setSelectedConversation } = useContext(AppContext)
	const { data: userData } = useSession()

	const { addQuery } = useConversationQuery()

	const [markAsRead] = useMutation<OpReturnType<'markAsRead'>, MutationMarkAsReadArgs>(ConversationOperations.Mutations.markAsRead)

	const markMessageAsRead = async (conversationId: string, hasSeenLatestMessage?: boolean) => {
		if (hasSeenLatestMessage) return
		if (!userData?.user.id) return
		try {
			await markAsRead({
				variables: {
					userId: userData.user.id,
					conversationId
				},
				optimisticResponse: {
					markAsRead: true
				},
				update: (cache) => updateMessageReadStatus(cache, userData, conversationId)
			})
		} catch (error) {
			console.log('onViewConversation error', error)
		}
	}

	const onSelectConversation = async (conversation: Conversation | null, hasSeenLatestMessage?: boolean) => {
		if (!conversation) return setSelectedConversation(null)
		setSelectedConversation(conversation)
		addQuery('conversationId', conversation.id)
		if (hasSeenLatestMessage) return
		if (!userData?.user.id) return
		await markMessageAsRead(conversation.id, hasSeenLatestMessage)
	}

	return {
		onSelectConversation,
		markMessageAsRead
	}
}

export default useSelectConversation
