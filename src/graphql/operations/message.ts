import { gql } from '@apollo/client'

export const MessageFields = `
    id
    sender {
        id
        username
    }
    body
    createdAt
`

export default {
	Query: {
		messages: gql`
			query messages($conversationId: String!) {
				messages(conversationId: $conversationId) {
                    ${MessageFields}
                }
			}
		`
	},
	Mutation: {
		sendMessage: gql`
			mutation sendMessage($id: String!, $conversationId: String!, $senderId: String!, $body: String!) {
				sendMessage(id: $id, conversationId: $conversationId, senderId: $senderId, body: $body)
			}
		`
	},
	Subscription: {
		messageSent: gql`
            subscription messageSent($conversationId: String!){
                messageSent(conversationId: $conversationId) {
                    ${MessageFields}
                }
            }
        `
	}
}
