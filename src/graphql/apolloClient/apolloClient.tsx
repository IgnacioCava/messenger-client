import { ApolloClient, HttpLink, InMemoryCache, concat } from '@apollo/client'
import { authMiddleware } from '../middleware/authentication'

const httpLink = new HttpLink({
	uri: 'http://localhost:4000/graphql',
	credentials: 'include'
})

const client = new ApolloClient({
	link: concat(authMiddleware, httpLink),
	cache: new InMemoryCache()
})

export default client
