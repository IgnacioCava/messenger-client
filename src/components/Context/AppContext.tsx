import { ReactNode, createContext, useState, useEffect } from 'react'
import ConversationOperations from '@/graphql/operations/conversation'
import { useAddQuery } from '@/hooks/useAddQuery'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { Query, Conversation } from '@/graphql/types'

interface AppContextValues {
	showChatList: boolean
	toggleChatList: (force?: boolean) => void
	showConversationForm: boolean
	toggleConversationForm: (force?: boolean) => void
	conversations: Conversation[] | undefined
	onSelectConversation: (conversation: Conversation) => void
	conversationId: string | null
	selectedConversation: Conversation | null
}

const defaultContext: AppContextValues = {
	showChatList: true,
	toggleChatList: () => {},
	showConversationForm: false,
	conversationId: null,
	toggleConversationForm: () => {},
	conversations: [],
	onSelectConversation: () => null,
	selectedConversation: null
}

export const AppContext = createContext<AppContextValues>(defaultContext)

interface AppContextProps {
	children: ReactNode
}

export const AppContextProvider: React.FC<AppContextProps> = ({ children }) => {
	const [showChatList, toggleChatList] = useState(true)
	const [showConversationForm, toggleConversationForm] = useState(false)
	const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

	const { addQuery } = useAddQuery()

	const conversationId = useSearchParams().get('conversationId')

	const { data, error, loading, subscribeToMore } = useQuery<Query>(ConversationOperations.Queries.conversations)

	const subscriptToNewConversations = () => {
		subscribeToMore({
			document: ConversationOperations.Subscription.conversationCreated,
			updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { conversationCreated: Conversation } } }) => {
				if (!subscriptionData.data) return prev

				const newConverstion = subscriptionData.data.conversationCreated
				return Object.assign({}, prev, {
					conversations: [newConverstion, ...prev.conversations]
				})
			}
		})
	}

	useEffect(() => {
		subscriptToNewConversations()
	}, [])

	const onSelectConversation = (conversation: Conversation) => {
		setSelectedConversation(conversation)
		addQuery('conversationId', conversation.id)
	}

	const value: AppContextValues = {
		selectedConversation,
		conversations: data?.conversations,
		onSelectConversation,
		showChatList,
		showConversationForm,
		conversationId,
		toggleChatList: (force) => toggleChatList(force ?? !showChatList),
		toggleConversationForm: (force) => toggleConversationForm(force ?? !showChatList)
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
