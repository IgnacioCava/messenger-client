import { ApolloProvider as Provider } from '@apollo/client'
import client from './apolloClient'

interface ApolloProviderProps {
	children: React.ReactNode
}

export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
	return <Provider client={client}>{children}</Provider>
}

export default ApolloProvider
