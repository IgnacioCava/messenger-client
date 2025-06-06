'use client'

import { Auth, ChatList, Conversation } from '@/components'
import { AppContextProvider } from '@/context/AppContext'
import { ConversationContextProvider } from '@/context/ConversationContext'
import { useSession } from 'next-auth/react'

export default function Home() {
	const { data: session, status } = useSession()

	if (status === 'loading') return null

	return (
		<div className='flex s-full m-auto bg-gray-200'>
			{session?.user.username ? (
				<AppContextProvider>
					<ChatList />
					<ConversationContextProvider>
						<Conversation />
					</ConversationContextProvider>
				</AppContextProvider>
			) : (
				<Auth />
			)}
		</div>
	)
}
