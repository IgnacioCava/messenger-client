'use client'

import useCreateUsername from '@/hooks/useCreateUsername'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { SignInGoogleButton, SignOutButton } from '../AuthButtons'

export const Auth: React.FC = () => {
	const { data: session } = useSession()
	const [username, setUsername] = useState('')
	const { onCreateUsername } = useCreateUsername()

	return (
		<div className='m-auto flex items-center gap-3 h-fit flex-col justify-center'>
			{session ? (
				<>
					<p>Create username</p>
					<input className='text-black' onChange={(event) => setUsername(event.target.value)} />
					<button onClick={() => onCreateUsername(username)}>Send</button>
					<SignOutButton />
				</>
			) : (
				<>
					<h1 className='text-3xl text-gray-700'>Messenger</h1>
					<SignInGoogleButton />
				</>
			)}
		</div>
	)
}
