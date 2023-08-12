'use client'

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from './nextAuthProvider'
import ApolloProvider from '@/graphql/apolloClient/apolloProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Messenger App',
	description: 'A messaging app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<ApolloProvider>
					<NextAuthProvider>{children}</NextAuthProvider>
				</ApolloProvider>
			</body>
		</html>
	)
}
