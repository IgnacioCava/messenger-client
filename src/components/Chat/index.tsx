'use client'

import { SignOutButton } from '../AuthButtons'
import { useSession } from 'next-auth/react'

export const Chat: React.FC = () => {
	const { data: session } = useSession()
	return (
		<div className='m-auto flex items-center gap-3 flex-col justify-center h-screen'>
			<p className='break-all'>{session?.user?.email}</p>
			<p>CHAT</p>
			<SignOutButton />
		</div>
	)
}
