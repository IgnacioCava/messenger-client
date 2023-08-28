import ConversationOperations from '@/graphql/operations/conversation'
import {
	Conversation,
	ConversationDeletedSubscriptionPayload,
	ConversationParticipant,
	ConversationUpdatedSubscriptionPayload,
	MutationDeleteConversationArgs,
	MutationMarkAsReadArgs
} from '@/graphql/types'
import { useConversationQuery } from '@/hooks/useAddQuery'
import { OpReturnType } from '@/util/utilityTypes'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { ReactNode, createContext, useEffect, useState } from 'react'

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
	markMessageAsRead: (conversationId: string, hasSeenLatestMessage?: boolean) => Promise<void>
	onDeleteConversation: (conversationId: string) => Promise<void>
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
	loading: true,
	markMessageAsRead: async () => {},
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

	const { data: userData } = useSession()

	const { addQuery, resetQuery } = useConversationQuery()

	useEffect(() => {
		resetQuery()
	}, [])

	const conversationId = useSearchParams().get('conversationId') || ''

	const { data, error, loading, subscribeToMore } = useQuery<OpReturnType<'conversations'>>(ConversationOperations.Queries.conversations)

	const [markAsRead] = useMutation<OpReturnType<'markAsRead'>, MutationMarkAsReadArgs>(ConversationOperations.Mutations.markAsRead)

	const [deleteConversation] = useMutation<OpReturnType<'deleteConversation'>, MutationDeleteConversationArgs>(ConversationOperations.Mutations.deleteConversation)

	const subscribeToNewConversations = () => {
		subscribeToMore({
			document: ConversationOperations.Subscription.conversationCreated,
			updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { conversationCreated: Conversation } } }) => {
				if (!subscriptionData.data) return prev

				const newConverstion = subscriptionData.data.conversationCreated
				return Object.assign({}, prev, {
					conversations: [newConverstion, ...prev.conversations]
				})
			},
			onError: (error) => {
				console.log('newconvs', error)
			}
		})
	}

	useSubscription<OpReturnType<'conversationUpdated'>, ConversationUpdatedSubscriptionPayload>(ConversationOperations.Subscription.conversationUpdated, {
		onData: ({ client, data: subscriptionData }) => {
			if (!subscriptionData.data) return
			const { conversation } = subscriptionData.data?.conversationUpdated

			const prevData = client.readQuery<OpReturnType<'conversations'>>({
				query: ConversationOperations.Queries.conversations
			})

			if (prevData?.conversations.length)
				client.writeQuery<OpReturnType<'conversations'>>({
					query: ConversationOperations.Queries.conversations,
					data: { conversations: [conversation, ...prevData.conversations.filter((conv) => conv.id !== conversation.id)] }
				})
			const viewing = conversation.id === conversationId
			if (viewing) markMessageAsRead(conversation.id)
		},
		onError: (error) => {
			console.log('convupdated', error)
		}
	})

	useSubscription<OpReturnType<'conversationDeleted'>, ConversationDeletedSubscriptionPayload>(ConversationOperations.Subscription.conversationDeleted, {
		onData: ({ client, data: subscriptionData }) => {
			if (!subscriptionData.data) return
			const existingConversations = client.readQuery<OpReturnType<'conversations'>>({
				query: ConversationOperations.Queries.conversations
			})

			if (!existingConversations) return

			const { conversations } = existingConversations
			const { id: deletedId } = subscriptionData.data?.conversationDeleted
			client.writeQuery<OpReturnType<'conversations'>>({
				query: ConversationOperations.Queries.conversations,
				data: {
					conversations: conversations.filter((conv) => conv.id !== deletedId)
				}
			})
		},
		onError: (error) => {
			console.log('convdeleted', error)
		}
	})

	const onDeleteConversation = async (conversationId: string) => {
		try {
			await deleteConversation({
				variables: { conversationId },
				update: () => {
					resetQuery()
				}
			})
		} catch (error) {
			console.log('onDeleteConversation error', error)
		}
	}

	useEffect(() => {
		subscribeToNewConversations()
	}, [])

	const markMessageAsRead = async (conversationId: string, hasSeenLatestMessage?: boolean) => {
		if (hasSeenLatestMessage) return
		if (!userData?.user.id) return
		try {
			await markAsRead({
				variables: {
					userId: userData.user.id,
					conversationId
				},
				optimisticResponse: {
					markAsRead: true
				},
				update: (cache) => {
					const participantsFragment = cache.readFragment<{
						users: ConversationParticipant[]
					}>({
						id: `Conversation:${conversationId}`,
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

					participants[userParticipantIdx] = {
						...userParticipant,
						hasSeenLatestMessage: true
					}

					cache.writeFragment({
						id: `Conversation:${conversationId}`,
						fragment: gql`
							fragment UpdatedParticipant on Conversation {
								users {
									user {
										id
										username
									}
									hasSeenLatestMessage
								}
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

	const onSelectConversation = async (conversation: Conversation, hasSeenLatestMessage: boolean | undefined) => {
		setSelectedConversation(conversation)
		addQuery('conversationId', conversation.id)
		if (hasSeenLatestMessage) return
		if (!userData?.user.id) return
		await markMessageAsRead(conversation.id, hasSeenLatestMessage)
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
		toggleConversationForm: (force) => toggleConversationForm(force ?? !showChatList),
		markMessageAsRead,
		onDeleteConversation
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
