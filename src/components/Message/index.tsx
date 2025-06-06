import { Message as MessageType } from '@/graphql/types'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import useSubscribeToMessages from '@/hooks/useSubscribeToMessages'
import { formatTime, is } from '@/util/functions'
import { MessageProps, Skeleton, UserIcon } from '@components'
import { useSession } from 'next-auth/react'

export const Message = ({ data, prevMessageSender }: MessageProps) => {
	const { data: userData } = useSession()
	const { body, createdAt, sender } = data
	const right = sender.id === userData?.user.id
	const isPrevMessageFromSameSender = sender.id === prevMessageSender
	return (
		<div className={`flex gap-2 ${is(right, 'justify-end')}  ${isPrevMessageFromSameSender ? 'm-0' : ''}`}>
			{!isPrevMessageFromSameSender ? <UserIcon right={right} /> : null}
			<div className={`col overflow-hidden w-full ${is(right, 'items-end')} ${isPrevMessageFromSameSender ? '' : 'gap-2'}`}>
				<p className='text-sm flex gap-2'>
					<>
						<span className={`text-zinc-500 text-sm font-medium ${right ? 'order-1' : 'order-2'} ${isPrevMessageFromSameSender ? (right ? 'mr-[48px]' : 'ml-[48px]') : ''}`}>
							{formatTime(createdAt)}
						</span>
						{!isPrevMessageFromSameSender ? <span className={`text-zinc-800 font-bold  ${right ? 'order-2' : 'order-1'}`}>{right ? 'You' : sender.username}</span> : null}
					</>
				</p>
				<div
					className={`xl:max-w-[60%] lg:max-w-[75%] max-w-[calc(100%-48px)] w-fit break-words whitespace-pre-wrap p-3 rounded-xl text-base ${is(
						right,
						'bg-stone-200 text-gray-800 font-medium rounded-tr-sm',
						'bg-indigo-500 text-white rounded-tl-sm'
					)} ${isPrevMessageFromSameSender ? (right ? 'mr-[48px]' : 'ml-[48px]') : ''} `}
				>
					{body}
				</div>
			</div>
		</div>
	)
}

export const Messages = () => {
	const { messages, loading } = useSubscribeToMessages()
	const { ref } = useAutoScroll<HTMLDivElement>({ deps: [messages] })

	return (
		<div ref={ref} className='p-2 xl:p-6 [&>*:not(:first-child)]:mt-4 overflow-auto h-full'>
			{loading && <Skeleton count={10} className='h-full col overflow-hidden [&>*:nth-child(even)]:self-end ' childrenClassName='w-[45%] h-[36px] rounded mt-2' />}
			{messages?.map((message, i) => <Message data={message} key={message.id} prevMessageSender={messages[i - 1]?.sender.id || ''} />)}
		</div>
	)
}
