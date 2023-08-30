import MessageOperations from '@/graphql/operations/message'
import { OpReturnType } from '@/util/utilityTypes'
import { ApolloCache, FetchResult } from '@apollo/client'
import { Session } from 'next-auth'
import { Message, MutationSendMessageArgs } from '../types'

interface UpdateMessageReadStatusProps {
	newMessage: MutationSendMessageArgs
	cache: ApolloCache<unknown>
	data: Omit<FetchResult<OpReturnType<'sendMessage'>>, 'context'>
	userData: Session
}

type MessageWithSenderId = Message & { senderId: string }

const addMessageToCache = ({ newMessage, cache, data, userData }: UpdateMessageReadStatusProps) => {
	if (!data.data) return
	const existing = cache.readQuery<{ messages: MessageWithSenderId[] }>({
		query: MessageOperations.Query.messages,
		variables: { conversationId: newMessage.conversationId }
	})
	const { email, id, username, image } = userData.user
	if (!existing) return
	cache.writeQuery<{ messages: MessageWithSenderId[] }, { conversationId: string }>({
		query: MessageOperations.Query.messages,
		variables: { conversationId: newMessage.conversationId },
		data: {
			...existing,
			messages: [
				...existing.messages,
				{
					...newMessage,
					id: data.data?.sendMessage as string,
					createdAt: new Date(Date.now()),
					sender: {
						id,
						username,
						email: email as string,
						image
					}
				}
			]
		}
	})
}

export default addMessageToCache
