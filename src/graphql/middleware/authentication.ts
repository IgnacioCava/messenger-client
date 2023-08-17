import { setContext } from '@apollo/client/link/context'
import { getSession } from 'next-auth/react'

export const authMiddleware = setContext(async (operation, { headers }) => {
	try {
		const session = await getSession()

		// const { user } = await fetch('/api/session').then((res) => res.json())
		return {
			headers: {
				...headers,
				session: JSON.stringify(session?.user)
			}
		}
	} catch (error) {
		console.log(error)
	}
})
