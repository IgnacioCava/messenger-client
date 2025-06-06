import { signOut } from 'next-auth/react'

export const Logout = () => {
	return (
		<button className='mx-3 mb-3 rounded p-2 bg-indigo-500' onClick={() => signOut()}>
			Log out
		</button>
	)
}
