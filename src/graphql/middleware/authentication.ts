import { setContext } from '@apollo/client/link/context'

export const authMiddleware = setContext(async (operation, { headers }) => {
	try {
		const { user } = await fetch('/api/session').then((res) => res.json())
		return {
			headers: {
				...headers,
				user: JSON.stringify(user)
			}
		}
	} catch (error) {
		console.log(error)
	}
})
