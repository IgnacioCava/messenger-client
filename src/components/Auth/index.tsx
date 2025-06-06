'use client'

import useCreateUsername from '@/hooks/useCreateUsername'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { SignInGoogleButton } from '../AuthButtons'

export const Auth: React.FC = () => {
	const { data: session } = useSession()
	const [username, setUsername] = useState('')
	const { onCreateUsername } = useCreateUsername()

	return (
		<div className='m-auto flex items-center p-4 rounded-xl gap-3 h-fit flex-col justify-center bg-slate-300 text-black'>
			{session ? (
				<>
					<p>Create username</p>
					<input className='text-black p-2 rounded outline-none' placeholder='Enter a username' onChange={(event) => setUsername(event.target.value)} />
					<button className='bg-indigo-500 text-white p-3 w-full rounded' onClick={() => onCreateUsername(username)}>
						Start
					</button>
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
