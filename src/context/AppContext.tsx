import ConversationOperations from '@/graphql/operations/conversation'
import { Conversation, MutationDeleteConversationArgs } from '@/graphql/types'
import { useConversationQuery } from '@/hooks/useConversationQuery'
import useSubscribeToConversationEvents from '@/hooks/useSubscribeToConversationEvents'
import { OpReturnType } from '@/util/utilityTypes'
import { useMutation } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import { createContext, useState } from 'react'
import { AppContextValues, ContextProps } from './types'

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

export const AppContextProvider: React.FC<ContextProps> = ({ children }) => {
	const [showChatList, toggleChatList] = useState(true)
	const [showConversationForm, toggleConversationForm] = useState(false)
	const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

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
