'use client'

import ApolloProvider from '@/graphql/apolloClient/apolloProvider'
import { NextAuthProvider } from './nextAuthProvider'

interface ProviderProps {
	children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
	return (
		<ApolloProvider>
			<NextAuthProvider>{children}</NextAuthProvider>
		</ApolloProvider>
	)
}

export default Providers
