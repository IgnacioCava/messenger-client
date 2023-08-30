import MessageOperations from '@/graphql/operations/message'
import { MutationSendMessageArgs } from '@/graphql/types'
import addMessageToCache from '@/graphql/util/addMessageToCache'
import { useAutoResize } from '@/hooks/useAutoResize'
import { OpReturnType } from '@/util/utilityTypes'
import { useMutation } from '@apollo/client'
import ObjectID from 'bson-objectid'
import { useSession } from 'next-auth/react'
import { KeyboardEvent, createContext, useContext, useState } from 'react'
import { AppContext } from './AppContext'
import { ContextProps, ConversationContextValues } from './types'

const defaultContext: ConversationContextValues = {
	message: '',
	setMessage: () => {},
	onSendMessage: async () => {},
	onKeyDown: async () => {},
	elementRef: null
}

export const ConversationContext = createContext<ConversationContextValues>(defaultContext)

export const ConversationContextProvider: React.FC<ContextProps> = ({ children }) => {
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
				update: (cache, data) => addMessageToCache({ newMessage, cache, data, userData })
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
