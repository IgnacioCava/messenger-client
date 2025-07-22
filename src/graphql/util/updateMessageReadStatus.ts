import { ApolloCache, gql } from '@apollo/client'
import { Session } from 'next-auth'
import { ConversationParticipant } from '../types'

const updateMessageReadStatus = (cache: ApolloCache<unknown>, userData: Session, conversationId: string) => {
	const conversation = cache.readFragment<{
		users: ConversationParticipant[]
	}>({
		id: `Conversation:${conversationId}`,
		fragment: gql`
			fragment Participant on Conversation {
				users {
					user {
						id
						image
						username
					}
					id
					hasSeenLatestMessage
				}
			}
		`
	})

	if (!conversation) return

	const participant = conversation.users.find((p) => p.user.id === userData.user.id)
	if (!participant) return

	cache.writeFragment({
		id: `ConversationParticipant:${participant.id}`,
		fragment: gql`
			fragment SeenFlag on ConversationParticipant {
				hasSeenLatestMessage
			}
		`,
		data: {
			hasSeenLatestMessage: true
		}
	})
}

export default updateMessageReadStatus
