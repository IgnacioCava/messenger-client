import { gql } from '@apollo/client'

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
		id
		sender {
			id
			username
		}
		body
		createdAt
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
		`
	},
	Subscription: {
		conversationCreated: gql`
			subscription conversationCreated {
				conversationCreated {
					${ConversationFields}
				}
			}
		`
	}
}
