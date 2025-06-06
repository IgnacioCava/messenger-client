'use client'
import { signIn, signOut } from 'next-auth/react'

const SignInGoogleButton = () => {
	return (
		<button className='bg-indigo-500 rounded p-2 px-3 text-gray-200 font-medium' onClick={() => signIn('google')}>
			Sign in
		</button>
	)
}

const SignOutButton = () => {
	return (
		<button className='bg-zinc-700 rounded p-1.5' onClick={() => signOut()}>
			Sign out
		</button>
	)
}

export { SignInGoogleButton, SignOutButton }
