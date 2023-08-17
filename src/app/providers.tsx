'use client'

import ApolloProvider from '@/graphql/apolloClient/apolloProvider'
import { NextAuthProvider } from './nextAuthProvider'
import { AppContextProvider } from '@/components/Context/AppContext'

interface ProviderProps {
	children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
	return (
		<ApolloProvider>
			<NextAuthProvider>
				<AppContextProvider>{children}</AppContextProvider>
			</NextAuthProvider>
		</ApolloProvider>
	)
}

export default Providers
