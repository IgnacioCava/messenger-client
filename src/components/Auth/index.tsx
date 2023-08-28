'use client'

import UserOperations from '@/graphql/operations/user'
import { Mutation, MutationCreateUsernameArgs } from '@/graphql/types'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { SignInGoogleButton, SignOutButton } from '../buttons'

interface AuthProps {}

export const Auth: React.FC<AuthProps> = () => {
	const { data: session, update } = useSession()
	const [username, setUsername] = useState('')

	const onSubmit = async () => {
		if (!username) return
		try {
			await createUsername({
				variables: { username },
				onCompleted: () => update(),
				onError: (error) => {
					throw new Error(error.message)
				}
			})

			update()
		} catch (error) {
			alert(error)
		}
	}

	const [createUsername, { data, loading, error }] = useMutation<Mutation, MutationCreateUsernameArgs>(UserOperations.Mutations.createUsername)

	return (
		<div className='m-auto flex items-center gap-3 h-fit flex-col justify-center'>
			{session ? (
				<>
					<p>Create username</p>
					<input className='text-black' onChange={(event) => setUsername(event.target.value)} />
					<button onClick={onSubmit}>Send</button>
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
