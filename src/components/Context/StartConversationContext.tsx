import ConversationOperations from '@/graphql/operations/conversation'
import UserOperations from '@/graphql/operations/user'
import { Mutation, MutationCreateConversationArgs, Query, QuerySearchUsersArgs, SearchedUser } from '@/graphql/types'
import { useConversationQuery } from '@/hooks/useConversationQuery'
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { ReactNode, RefObject, createContext, useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from './AppContext'

type DisplayableUser = SearchedUser & { display?: boolean }

interface StartConversationContextValues {
	foundUsers: DisplayableUser[] | undefined | null
	loading: boolean
	error: ApolloError | undefined
	ready: boolean
	loadingCreateConversation: boolean
	searchUsers: (username: string) => void
	selectedUsers: SearchedUser[]
	addUser: (addedUser: SearchedUser) => void
	removeUser: (removedUserId: SearchedUser['id']) => void
	closeForm: () => void
	onCreateConversation: () => void
	formRef: RefObject<HTMLFormElement> | null
}

const defaultContext: StartConversationContextValues = {
	foundUsers: [],
	loading: false,
	error: undefined,
	ready: false,
	loadingCreateConversation: false,
	searchUsers: () => {},
	selectedUsers: [],
	addUser: () => {},
	removeUser: () => {},
	closeForm: () => {},
	onCreateConversation: () => {},
	formRef: null
}

export const StartConversationContext = createContext<StartConversationContextValues>(defaultContext)

interface StartConversationContextProps {
	children: ReactNode
}

export const StartConversationContextProvider: React.FC<StartConversationContextProps> = ({ children }) => {
	const [selectedUsers, setSelectedUsers] = useState<SearchedUser[]>([])
	const [foundUsers, setFoundUsers] = useState<DisplayableUser[] | null>(null)
	const { showConversationForm, toggleConversationForm } = useContext(AppContext)
	const { data } = useSession()

	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (!showConversationForm) formRef.current?.reset()
	}, [showConversationForm])

	const { addQuery } = useConversationQuery()

	const [searchUsers, { loading, error }] = useLazyQuery<Query, QuerySearchUsersArgs>(UserOperations.Queries.searchUsers)
	const [createConversation, { loading: loadingCreateConversation }] = useMutation<Mutation, MutationCreateConversationArgs>(ConversationOperations.Mutations.createConversation)

	const search = (username: string) => {
		searchUsers({
			variables: { username, excludedIds: selectedUsers.map((user) => user.id) },
			onCompleted: ({ searchUsers }) => searchUsers && setFoundUsers(searchUsers)
		})
	}

	const addSelectedUser = (addedUser: SearchedUser) => {
		if (selectedUsers.some(({ id }) => id === addedUser.id)) return
		setSelectedUsers((users) => [...users, addedUser])
		setFoundUsers((users) => users && users.map((user) => (user.id === addedUser.id ? { ...user, display: false } : user)))
	}

	const removeSelectedUser = (removedUserId: SearchedUser['id']) => {
		setSelectedUsers((users) => users.filter(({ id }) => id !== removedUserId))
		setFoundUsers((users) => users && users.map((user) => (user.id === removedUserId ? { ...user, display: true } : user)))
	}

	const closeForm = () => {
		setSelectedUsers([])
		setFoundUsers(null)
		toggleConversationForm(false)
	}

	const onCreateConversation = async () => {
		try {
			const participantIds = [...selectedUsers.map(({ id }) => id), data?.user.id as string]
			await createConversation({
				variables: { participantIds },
				onCompleted: ({ createConversation }) => createConversation?.conversationId && addQuery('conversationId', createConversation?.conversationId),
				onError: () => {
					throw { message: 'Error creating conversation' }
				}
			})

			closeForm()
		} catch (error) {
			console.log(error)
		}
	}

	const value: StartConversationContextValues = {
		foundUsers,
		loading,
		error,
		loadingCreateConversation,
		ready: !loading && !error,
		searchUsers: search,
		selectedUsers,
		addUser: addSelectedUser,
		removeUser: removeSelectedUser,
		closeForm,
		onCreateConversation,
		formRef
	}

	return <StartConversationContext.Provider value={value}>{children}</StartConversationContext.Provider>
}
