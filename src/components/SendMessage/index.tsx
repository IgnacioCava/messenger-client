import MessageOperations from '@/graphql/operations/message'
import { Message, Mutation, MutationSendMessageArgs } from '@/graphql/types'
import { useMutation } from '@apollo/client'
import ObjectID from 'bson-objectid'
import { useSession } from 'next-auth/react'
import { KeyboardEventHandler, useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../Context/AppContext'

type Mess = Message & { senderId: string }

export const SendMessage = () => {
	const { selectedConversation } = useContext(AppContext)
	const { data: userData } = useSession()

	const [message, setMessage] = useState('')

	const [sendMessage] = useMutation<Mutation, MutationSendMessageArgs>(MessageOperations.Mutation.sendMessage)

	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		textareaRef.current && autoResize(textareaRef.current)
	}, [message])

	const onSendMessage: KeyboardEventHandler<HTMLTextAreaElement> = async (event) => {
		event.preventDefault()
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
					const existing = cache.readQuery<{ messages: Mess[] }>({
						query: MessageOperations.Query.messages,
						variables: { conversationId }
					}) as { messages: Mess[] }

					const { email, id, username, image } = userData.user

					cache.writeQuery<{ messages: Mess[] }, { conversationId: string }>({
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

	const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
		if (event.key === 'Enter') {
			if (event.ctrlKey || event.altKey || event.shiftKey) {
				event.preventDefault()
				setMessage(message + '\n')
			} else onSendMessage(event)
		}
	}

	const autoResize = (target: HTMLTextAreaElement) => {
		target.style.height = '0'
		target.style.height = target.scrollHeight + 'px'
	}

	return (
		<div className='w-full p-3 bg-zinc-800'>
			<textarea
				ref={textareaRef}
				onKeyDown={onKeyDown}
				value={message}
				placeholder='Send message'
				className='w-full outline-none font-light bg-zinc-900 rounded px-3 py-1 resize-none max-h-[100px] block h-8 overflow-y-hidden'
				onChange={({ target }) => setMessage(target.value)}
			/>
		</div>
	)
}
