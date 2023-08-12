'use client'

import { SignInGoogleButton, SignOutButton } from '../buttons'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import UserOperations from '@/graphql/operations/user'
import { MutationCreateUsernameArgs, Mutation } from '@/graphql/types'
import { useSession } from 'next-auth/react'

interface AuthProps {}

const Auth: React.FC<AuthProps> = () => {
	const { data: session, update } = useSession()
	const [username, setUsername] = useState('')

	const onSubmit = async () => {
		if (!username) return
		try {
			const { data } = await createUsername({ variables: { username } })

			if (!data?.createUsername) throw new Error()
			if (data.createUsername.error) {
				const { error } = data.createUsername
				throw new Error(error)
			}

			update()
		} catch (error) {
			alert(error)
		}
	}

	const [createUsername, { data, loading, error }] = useMutation<Mutation, MutationCreateUsernameArgs>(UserOperations.Mutations.createUsername)

	return (
		<div className='m-auto flex items-center gap-3 h-screen flex-col justify-center'>
			{session ? (
				<>
					<p>Create username</p>
					<input
						className='text-black'
						onChange={(event) => setUsername(event.target.value)}
					/>
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

export default Auth
