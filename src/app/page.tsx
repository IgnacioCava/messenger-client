'use client'

import { Auth, ChatList, Conversation } from '@/components'
import { ConversationContextProvider } from '@/components/Context/ConversationContext'
import { useSession } from 'next-auth/react'

export default function Home() {
	const { data: session, status } = useSession()

	if (status === 'loading') return null
	//return <div className='col'>{session?.user.username ? <Chat /> : <Auth />}</div>
	return (
		<div className='flex s-full xl:w-app-max xl:max-w-app-max xl:h-[95%] m-auto'>
			{session?.user.username ? (
				<>
					<ChatList />
					<ConversationContextProvider>
						<Conversation />
					</ConversationContextProvider>
				</>
			) : (
				<Auth />
			)}
		</div>
	)
}
