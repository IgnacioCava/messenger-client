'use client'

import { useSession } from 'next-auth/react'

import { ChatList, Conversation } from '@/components'

export default function Home() {
	const { data: session, status } = useSession()

	if (status === 'loading') return null
	//return <div className='col'>{session?.user.username ? <Chat /> : <Auth />}</div>
	return (
		<div className='flex s-full xl:w-app-max xl:max-w-app-max xl:h-[95%] m-auto'>
			<ChatList />
			<Conversation />
			{session?.user.username}
		</div>
	)
}
