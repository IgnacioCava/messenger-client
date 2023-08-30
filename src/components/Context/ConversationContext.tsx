import MessageOperations from '@/graphql/operations/message'
import { Message, MutationSendMessageArgs, QueryMessagesArgs } from '@/graphql/types'
import { useAutoResize } from '@/hooks/useAutoResize'
import { OpReturnType } from '@/util/utilityTypes'
import { useMutation, useQuery } from '@apollo/client'
import ObjectID from 'bson-objectid'
import { useSession } from 'next-auth/react'
import { Dispatch, KeyboardEvent, ReactNode, RefObject, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { AppContext } from './AppContext'

interface ConversationContextValues {
	message: string
	setMessage: Dispatch<SetStateAction<string>>
	onSendMessage: () => Promise<void>
	onKeyDown: <T extends HTMLElement>(event: KeyboardEvent<T>) => Promise<void>
	elementRef: RefObject<HTMLTextAreaElement> | null
}

const defaultContext: ConversationContextValues = {
	message: '',
	setMessage: () => {},
	onSendMessage: async () => {},
	onKeyDown: async () => {},
	elementRef: null
}

export const ConversationContext = createContext<ConversationContextValues>(defaultContext)

interface ConversationContextProps {
	children: ReactNode
}

type MessageWithSenderId = Message & { senderId: string }

export const ConversationContextProvider: React.FC<ConversationContextProps> = ({ children }) => {
	const { selectedConversation } = useContext(AppContext)
	const [message, setMessage] = useState('')
	const { data: userData } = useSession()

	const { ref } = useAutoResize({ deps: [message] })

	const [sendMessage] = useMutation<OpReturnType<'sendMessage'>, MutationSendMessageArgs>(MessageOperations.Mutation.sendMessage)

	const onSendMessage = async () => {
		if (!message.trim()) return
		try {
			if (!userData?.user) throw new Error('Not authorized')
			const { id: senderId } = userData.user
			const conversationId = selectedConversation?.id as string
			const newMessage: MutationSendMessageArgs = {
				senderId,
				conversationId,
				body: message.trim()
			}
			setMessage('')
			const { data, errors } = await sendMessage({
				variables: newMessage,
				optimisticResponse: { sendMessage: new ObjectID().toString() },
				update: (cache, data) => {
					if (!data.data) return
					const existing = cache.readQuery<{ messages: MessageWithSenderId[] }>({
						query: MessageOperations.Query.messages,
						variables: { conversationId }
					})
					const { email, id, username, image } = userData.user
					if (!existing) return
					cache.writeQuery<{ messages: MessageWithSenderId[] }, { conversationId: string }>({
						query: MessageOperations.Query.messages,
						variables: { conversationId },
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
			})
			if (!data?.sendMessage || errors) throw new Error('Failed to send message')
		} catch (error) {
			console.log(error)
		}
	}

	const onKeyDown = async <T extends HTMLElement>(event: KeyboardEvent<T>) => {
		const { key, ctrlKey, altKey, shiftKey } = event
		if (key === 'Enter') {
			event.preventDefault()
			ctrlKey || altKey || shiftKey ? setMessage(message + '\n') : onSendMessage()
		}
	}

	const value: ConversationContextValues = {
		message,
		setMessage,
		onSendMessage,
		onKeyDown,
		elementRef: ref
	}

	return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>
}
