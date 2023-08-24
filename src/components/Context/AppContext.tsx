import { ReactNode, createContext, useState, useEffect } from 'react'
import ConversationOperations from '@/graphql/operations/conversation'
import { useAddQuery } from '@/hooks/useAddQuery'
import { useSearchParams } from 'next/navigation'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Query, Conversation, Mutation, MutationMarkAsReadArgs, ConversationParticipant, SearchedUser } from '@/graphql/types'
import { useSession } from 'next-auth/react'

interface AppContextValues {
	showChatList: boolean
	toggleChatList: (force?: boolean) => void
	showConversationForm: boolean
	toggleConversationForm: (force?: boolean) => void
	conversations: Conversation[] | undefined
	onSelectConversation: (conversation: Conversation, hasSeenLatestMessage: boolean) => Promise<void>
	conversationId: string
	selectedConversation: Conversation | null
	loading: boolean
}

const defaultContext: AppContextValues = {
	showChatList: true,
	toggleChatList: () => {},
	showConversationForm: false,
	conversationId: '',
	toggleConversationForm: () => {},
	conversations: [],
	onSelectConversation: async () => {},
	selectedConversation: null,
	loading: true
}

export const AppContext = createContext<AppContextValues>(defaultContext)

interface AppContextProps {
	children: ReactNode
}

export const AppContextProvider: React.FC<AppContextProps> = ({ children }) => {
	const [showChatList, toggleChatList] = useState(true)
	const [showConversationForm, toggleConversationForm] = useState(false)
	const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

	const { data: userData } = useSession()

	const { addQuery } = useAddQuery()

	const conversationId = useSearchParams().get('conversationId') || ''

	const { data, error, loading, subscribeToMore } = useQuery<Query>(ConversationOperations.Queries.conversations)

	const [markAsRead] = useMutation<Mutation, MutationMarkAsReadArgs>(ConversationOperations.Mutations.markAsRead)

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

	const onSelectConversation = async (conversation: Conversation, hasSeenLatestMessage: boolean | undefined) => {
		setSelectedConversation(conversation)
		addQuery('conversationId', conversation.id)
		console.log(hasSeenLatestMessage)
		if (hasSeenLatestMessage) return
		if (!userData?.user.id) return
		try {
			await markAsRead({
				variables: {
					userId: userData.user.id,
					conversationId: conversation.id
				},
				optimisticResponse: {
					markAsRead: true
				},
				update: (cache) => {
					/**
					 * Get conversation participants from cache
					 */
					const participantsFragment = cache.readFragment<{
						users: ConversationParticipant[]
					}>({
						id: `Conversation:${conversation.id}`,
						fragment: gql`
							fragment Participants on Conversation {
								users {
									user {
										id
										username
									}
									hasSeenLatestMessage
								}
							}
						`
					})

					if (!participantsFragment) return

					const participants = [...participantsFragment.users]

					const userParticipantIdx = participants.findIndex((p) => p.user.id === userData.user.id)

					if (userParticipantIdx === -1) return

					const userParticipant = participants[userParticipantIdx]

					/**
					 * Update participant to show latest message as read
					 */
					participants[userParticipantIdx] = {
						...userParticipant,
						hasSeenLatestMessage: true
					}

					/**
					 * Update cache
					 */
					cache.writeFragment({
						id: `Conversation:${conversation.id}`,
						fragment: gql`
							fragment UpdatedParticipant on Conversation {
								users
							}
						`,
						data: {
							users: participants
						}
					})
				}
			})
		} catch (error) {
			console.log('onViewConversation error', error)
		}
	}

	const value: AppContextValues = {
		selectedConversation,
		conversations: data?.conversations,
		onSelectConversation,
		showChatList,
		showConversationForm,
		conversationId,
		loading,
		toggleChatList: (force) => toggleChatList(force ?? !showChatList),
		toggleConversationForm: (force) => toggleConversationForm(force ?? !showChatList)
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
