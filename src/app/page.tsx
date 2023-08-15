'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { ChatList, Conversation } from '@/components'

export default function Home() {
	const { data: session, status } = useSession()

	const [hideList, setHideList] = useState(false)
	const [showConversationForm, setConversationForm] = useState(false)

	if (status === 'loading') return null
	// return <div className='col'>{session?.user.username ? <Chat /> : <Auth />}</div>
	return (
		<div className='flex s-full xl:w-app-max xl:max-w-app-max xl:h-[95%] m-auto'>
			<ChatList list={hideList} show={showConversationForm} toggle={() => setConversationForm(!showConversationForm)} />
			<Conversation toggleList={() => setHideList(!hideList)} list={!hideList} />
		</div>
	)
}
