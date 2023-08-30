'use client'

import useCreateUsername from '@/hooks/useCreateUsername'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { SignInGoogleButton, SignOutButton } from '../buttons'

interface AuthProps {}

export const Auth: React.FC<AuthProps> = () => {
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
					<p>Messenger</p>
					<SignInGoogleButton />
				</>
			)}
		</div>
	)
}
