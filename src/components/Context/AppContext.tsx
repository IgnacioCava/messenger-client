import ConversationOperations from '@/graphql/operations/conversation'
import { Conversation, MutationDeleteConversationArgs } from '@/graphql/types'
import { useConversationQuery } from '@/hooks/useConversationQuery'
import useSelectConversation from '@/hooks/useSelectConversation'
import useSubscribeToConversationEvents from '@/hooks/useSubscribeToConversationEvents'
import { OpReturnType } from '@/util/utilityTypes'
import { useMutation, useQuery } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import { ReactNode, createContext, useEffect, useState } from 'react'

interface AppContextValues {
	showChatList: boolean
	toggleChatList: (force?: boolean) => void
	showConversationForm: boolean
	toggleConversationForm: (force?: boolean) => void
	conversations: Conversation[] | undefined
	conversationId: string
	selectedConversation: Conversation | null
	setSelectedConversation: (conversation: Conversation) => void
	loading: boolean
	onDeleteConversation: (conversationId: string) => Promise<void>
}

const defaultContext: AppContextValues = {
	showChatList: true,
	toggleChatList: () => {},
	showConversationForm: false,
	conversationId: '',
	toggleConversationForm: () => {},
	conversations: [],
	selectedConversation: null,
	setSelectedConversation: () => {},
	loading: true,
	onDeleteConversation: async () => {}
}

export const AppContext = createContext<AppContextValues>(defaultContext)

interface AppContextProps {
	children: ReactNode
}

export const AppContextProvider: React.FC<AppContextProps> = ({ children }) => {
	const [showChatList, toggleChatList] = useState(true)
	const [showConversationForm, toggleConversationForm] = useState(false)
	const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

	const { onSelectConversation } = useSelectConversation()

	const { resetQuery } = useConversationQuery()

	const conversationId = useSearchParams().get('conversationId') || ''
	const { data, error, loading } = useSubscribeToConversationEvents()

	const [deleteConversation] = useMutation<OpReturnType<'deleteConversation'>, MutationDeleteConversationArgs>(ConversationOperations.Mutations.deleteConversation)

	const onDeleteConversation = async (conversationId: string) => {
		try {
			await deleteConversation({
				variables: { conversationId },
				update: () => {
					resetQuery()
					setSelectedConversation(null)
				}
			})
		} catch (error) {
			console.log('onDeleteConversation error', error)
		}
	}

	useEffect(() => {
		const conversation = data?.conversations.find((conv) => conv.id === conversationId)
		if (!conversation) return
		onSelectConversation(conversation, false)
	}, [conversationId])

	const value: AppContextValues = {
		selectedConversation,
		setSelectedConversation,
		conversations: data?.conversations,
		showChatList,
		showConversationForm,
		conversationId,
		loading,
		toggleChatList: (force) => toggleChatList(force ?? !showChatList),
		toggleConversationForm: (force) => toggleConversationForm(force ?? !showChatList),
		onDeleteConversation
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
