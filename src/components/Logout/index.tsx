import { signOut } from 'next-auth/react'

export const Logout = () => {
	return (
		<button className='mx-3 mb-3 rounded p-1 bg-slate-700' onClick={() => signOut()}>
			Logout
		</button>
	)
}
