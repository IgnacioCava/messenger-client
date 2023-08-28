import { gql } from '@apollo/client'
import { MessageFields } from './message'

const ConversationFields = `
	id
	users {
		user {
			id
			username
		}
		hasSeenLatestMessage
	}
	updatedAt
	lastMessage {
		${MessageFields}
	}
`

export default {
	Queries: {
		conversations: gql`
			query conversations {
				conversations {
					${ConversationFields}
				}
			}
		`
	},
	Mutations: {
		createConversation: gql`
			mutation createConversation($participantIds: [String]!) {
				createConversation(participantIds: $participantIds) {
					conversationId
				}
			}
		`,
		deleteConversation: gql`
			mutation deleteConversation($conversationId: String!) {
				deleteConversation(conversationId: $conversationId)
			}
		`,
		markAsRead: gql`
			mutation markAsRead($userId: String!, $conversationId: String!) {
				markAsRead(userId: $userId, conversationId: $conversationId)
			}
		`
	},
	Subscription: {
		conversationCreated: gql`
			subscription conversationCreated {
				conversationCreated {
					${ConversationFields}
				}
			}
		`,
		conversationUpdated: gql`
			subscription conversationUpdated {
				conversationUpdated {
					conversation {
						${ConversationFields}
					}
				}
			}
		`,
		conversationDeleted: gql`
			subscription conversationDeleted {
				conversationDeleted {
					id
				}
			}
		`
	}
}
