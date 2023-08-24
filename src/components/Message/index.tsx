import { Message as MessageType, Query, QueryMessagesArgs } from '@/graphql/types'
import { is, formatTime } from '@/util/functions'
import { useQuery } from '@apollo/client'
import { Spinner, UserIcon, Skeleton } from '@components'
import MessageOperations from '@/graphql/operations/message'
import { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../Context/AppContext'
import { useSession } from 'next-auth/react'

const testCases = [
	'Lorem ipsum dolor sit amet, consectetur adi',
	'LoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLor eLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLore',
	'Lorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adi'
]

export const Message = ({ data }: { data: MessageType }) => {
	const { data: userData } = useSession()
	const { body, createdAt, sender } = data
	const right = sender.id === userData?.user.id
	return (
		<div className={`flex gap-2 ${is(right, 'justify-end')} `}>
			<UserIcon right={right} />
			<div className={`col overflow-hidden w-full ${is(right, 'items-end')}`}>
				<p className='text-sm'>
					{is(right, 'You', 'Other user')} <span className='text-zinc-400 text-sm'>{formatTime(createdAt)}</span>
				</p>
				{/* {testCases.map((e, index) => (
					<div
						key={index}
						className={`xl:max-w-[60%] lg:max-w-[75%] max-w-[calc(100%-48px)] w-fit break-words whitespace-pre-wrap p-2 rounded ${is(right, 'bg-sky-900', 'bg-zinc-700')} text-sm`}
					>
						{e}
					</div>
				))} */}
				<div className={`xl:max-w-[60%] lg:max-w-[75%] max-w-[calc(100%-48px)] w-fit break-words whitespace-pre-wrap p-2 rounded ${is(right, 'bg-sky-900', 'bg-zinc-700')} text-sm`}>
					{body}
				</div>
			</div>
		</div>
	)
}

export const Messages = ({ conversationId }: { conversationId: string }) => {
	const { selectedConversation } = useContext(AppContext)
	const { data: userData } = useSession()

	const { data, loading, error, subscribeToMore } = useQuery<Query, QueryMessagesArgs>(MessageOperations.Query.messages, {
		variables: { conversationId: conversationId as string },
		onError: ({ message }) => {
			console.log(message)
		}
	})

	const messagesContainer = useRef<HTMLDivElement>(null)

	const subscribeToMoreMessages = (conversationId: string) => {
		subscribeToMore({
			document: MessageOperations.Subscription.messageSent,
			variables: { conversationId },
			updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { messageSent: MessageType } } }) => {
				if (!subscriptionData.data) return prev
				const newMessage = subscriptionData.data.messageSent

				return Object.assign({}, prev, {
					messages: newMessage.sender.id === userData?.user.id ? prev.messages : [...prev.messages, newMessage]
				})
			}
		})
	}

	useEffect(() => {
		if (data?.messages) messagesContainer.current?.scrollTo({ top: messagesContainer.current?.scrollHeight })
	}, [data?.messages, conversationId])

	useEffect(() => {
		console.log('xd')
		subscribeToMoreMessages(conversationId)
	}, [])

	return (
		<div ref={messagesContainer} className='p-2 xl:p-4 [&>*:not(:first-child)]:mt-4 overflow-auto h-full'>
			{loading && <Skeleton count={10} className='h-full col overflow-hidden [&>*:nth-child(even)]:self-end ' childrenClassName='w-[45%] h-[36px] rounded mt-2' />}
			{data?.messages?.map((message) => <Message data={message} key={message.id} />)}
		</div>
	)
}
