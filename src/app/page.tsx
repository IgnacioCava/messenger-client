'use client'

import { useSession } from 'next-auth/react'

import Auth from '@/components/Auth'
import Chat from '@/components/Chat'

export default function Home() {
	const { data: session, status } = useSession()

	if (status === 'loading') return null
	return <div className='flex flex-col'>{session?.user.username ? <Chat /> : <Auth />}</div>
}
