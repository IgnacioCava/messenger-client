import { AppContext } from '@/components/Context/AppContext'
import ConversationOperations from '@/graphql/operations/conversation'
import { Conversation, ConversationParticipant, MutationMarkAsReadArgs } from '@/graphql/types'
import { OpReturnType } from '@/util/utilityTypes'
import { gql, useMutation } from '@apollo/client'
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
				update: (cache) => {
					const participantsFragment = cache.readFragment<{
						users: ConversationParticipant[]
					}>({
						id: `Conversation:${conversationId}`,
						fragment: gql`
							fragment Participants on Conversation {
								users {
									user {
										id
										username
									}
									hasSeenLatestMessage
								}
							}
						`
					})

					if (!participantsFragment) return

					const participants = [...participantsFragment.users]

					const userParticipantIdx = participants.findIndex((p) => p.user.id === userData.user.id)

					if (userParticipantIdx === -1) return

					const userParticipant = participants[userParticipantIdx]

					participants[userParticipantIdx] = {
						...userParticipant,
						hasSeenLatestMessage: true
					}

					cache.writeFragment({
						id: `Conversation:${conversationId}`,
						fragment: gql`
							fragment UpdatedParticipant on Conversation {
								users {
									user {
										id
										username
									}
									hasSeenLatestMessage
								}
							}
						`,
						data: {
							users: participants
						}
					})
				}
			})
		} catch (error) {
			console.log('onViewConversation error', error)
		}
	}

	const onSelectConversation = async (conversation: Conversation, hasSeenLatestMessage: boolean | undefined) => {
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
