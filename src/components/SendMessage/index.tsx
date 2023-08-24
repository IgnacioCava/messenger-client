import { ChangeEventHandler, FormEventHandler, KeyboardEventHandler, useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import { useSession } from 'next-auth/react'
import { useMutation } from '@apollo/client'
import MessageOperations from '@/graphql/operations/message'
import { Message, Mutation, MutationSendMessageArgs, User } from '@/graphql/types'
import ObjectID from 'bson-objectid'

type Mess = Message & MutationSendMessageArgs

export const SendMessage = () => {
	const { conversationId, selectedConversation, conversations } = useContext(AppContext)
	const { data: userData } = useSession({ required: true })

	const [message, setMessage] = useState('')

	const [sendMessage, { data }] = useMutation<Mutation, MutationSendMessageArgs>(MessageOperations.Mutation.sendMessage)

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
			const messageId = new ObjectID().toString()
			const newMessage: MutationSendMessageArgs = {
				id: messageId,
				senderId,
				conversationId,
				body: message.trim()
			}
			setMessage('')
			const { data, errors } = await sendMessage({
				variables: newMessage,
				optimisticResponse: { sendMessage: true },
				update: (cache) => {
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
									id: messageId,
									conversationId,
									body: message.trim(),
									createdAt: new Date(Date.now()),
									senderId: id,
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

// const messages = cache.readFragment<{
// 	messages: Message[]
// }>({
// 	id: `Message:${messageId}`,
// 	fragment: gql`
// 			fragment Messages on Conversation {
// 				messages {
// 					message {
// 						${MessageFields}
// 					}
// 				}
// 			}
// 		`
// })

// if (!messages) return
