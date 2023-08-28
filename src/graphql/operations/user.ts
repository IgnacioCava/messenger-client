import { gql } from '@apollo/client'

export default {
	Queries: {
		searchUsers: gql`
			query searchUsers($username: String!, $excludedIds: [String]) {
				searchUsers(username: $username, excludedIds: $excludedIds) {
					id
					username
				}
			}
		`
	},
	Mutations: {
		createUsername: gql`
			mutation createUsername($username: String!) {
				createUsername(username: $username) {
					success
					error
				}
			}
		`
	},
	Subscription: {}
}
