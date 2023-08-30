import { ApolloCache, gql } from '@apollo/client'
import { Session } from 'next-auth'
import { ConversationParticipant } from '../types'

const updateMessageReadStatus = (cache: ApolloCache<unknown>, userData: Session, conversationId: string) => {
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

export default updateMessageReadStatus
