import { OpReturnType } from '@/util/utilityTypes'
import { useMutation } from '@apollo/client'
import UserOperations from '@/graphql/operations/user'
import { MutationCreateUsernameArgs } from '@/graphql/types'
import { useSession } from 'next-auth/react'

const useCreateUsername = () => {
	const { update } = useSession()

	const [createUsername] = useMutation<OpReturnType<'createUsername'>, MutationCreateUsernameArgs>(UserOperations.Mutations.createUsername)

	const onCreateUsername = async (username: string) => {
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

	return {
		onCreateUsername
	}
}

export default useCreateUsername
