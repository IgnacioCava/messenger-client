import { ApolloClient, HttpLink, InMemoryCache, concat, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { getSession } from 'next-auth/react'
import { authMiddleware } from '../middleware/authentication'

const httpLink = new HttpLink({
	uri: process.env.NEXT_PUBLIC_API_URI || 'http://localhost:4000/graphql',
	credentials: 'include'
})

const wsLink =
	typeof window !== 'undefined'
		? new GraphQLWsLink(
				createClient({
					url: process.env.NEXT_PUBLIC_WS_URI || 'ws://localhost:4000/graphql/subscriptions',
					connectionParams: async () => ({
						session: (await getSession())?.user
					})
				})
		  )
		: null

const splitLink =
	typeof window !== 'undefined' && wsLink !== null
		? split(
				({ query }) => {
					const definition = getMainDefinition(query)
					return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
				},
				wsLink,
				httpLink
		  )
		: httpLink

const client = new ApolloClient({
	link: concat(authMiddleware, splitLink),
	cache: new InMemoryCache()
})

export default client
