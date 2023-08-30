import { AppContext } from '@/context/AppContext'
import { OpReturnType } from '@/util/utilityTypes'
import { useQuery } from '@apollo/client'
import { useContext, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import MessageOperations from '@/graphql/operations/message'
import { Message } from 'postcss'
import { QueryMessagesArgs } from '@/graphql/types'

const useSubscribeToMessages = () => {
	const { selectedConversation } = useContext(AppContext)
	const { data: userData } = useSession()
	const { data, loading, error, subscribeToMore } = useQuery<OpReturnType<'messages'>, QueryMessagesArgs>(MessageOperations.Query.messages, {
		variables: { conversationId: selectedConversation?.id as string },
		onError: ({ message }) => {
			console.log(message)
		}
	})

	useEffect(() => {
		const unsubscribe = subscribeToMore({
			document: MessageOperations.Subscription.messageSent,
			variables: { conversationId: selectedConversation?.id },
			updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { messageSent: Message } } }) => {
				if (!subscriptionData.data) return prev

				const newMessage = subscriptionData.data.messageSent
				if (newMessage.sender.id === userData?.user.id) return prev
				return Object.assign({}, prev, {
					messages: [...prev.messages, newMessage]
				})
			},
			onError: (error) => {
				console.log('message', error)
			}
		})
		if (selectedConversation?.id) return () => unsubscribe()
	}, [subscribeToMore, selectedConversation?.id])

	return {
		messages: data?.messages,
		loading,
		error
	}
}

export default useSubscribeToMessages
