import ConversationOperations from '@/graphql/operations/conversation'
import { Conversation, ConversationDeletedSubscriptionPayload, ConversationUpdatedSubscriptionPayload } from '@/graphql/types'
import { OpReturnType } from '@/util/utilityTypes'
import { useQuery, useSubscription } from '@apollo/client'
import useSelectConversation from './useSelectConversation'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const useSubscribeToConversationEvents = () => {
	const { markMessageAsRead, onSelectConversation } = useSelectConversation()

	const conversationId = useSearchParams().get('conversationId') || ''

	const { data, error, loading, subscribeToMore } = useQuery<OpReturnType<'conversations'>>(ConversationOperations.Queries.conversations)

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

	useEffect(() => {
		subscribeToNewConversations()
	}, [])

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
			onSelectConversation(null)
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

	return {
		data,
		error,
		loading
	}
}

export default useSubscribeToConversationEvents
