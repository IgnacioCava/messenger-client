import { gql } from '@apollo/client'

const ConversationFields = `
	conversations {
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
			id
			sender {
				id
				username
			}
			body
			createdAt
		}
	}
`

export default {
	Queries: {
		conversations: gql`
			query conversations {
				${ConversationFields}
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
		`
	},
	Subscription: {}
}
