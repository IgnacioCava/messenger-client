'use client'

import { SignOutButton } from '../buttons'
import { useSession } from 'next-auth/react'

interface ChatProps {}

export const Chat: React.FC<ChatProps> = () => {
	const { data: session } = useSession()
	return (
		<div className='m-auto flex items-center gap-3 flex-col justify-center h-screen'>
			<p className='break-all'>{session?.user?.email}</p>
			<p>CHAT</p>
			<SignOutButton />
		</div>
	)
}
