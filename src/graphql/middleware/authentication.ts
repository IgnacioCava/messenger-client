import { setContext } from '@apollo/client/link/context'
import { getSession } from 'next-auth/react'

export const authMiddleware = setContext(async (_, { headers }) => {
	try {
		const session = await getSession()

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
