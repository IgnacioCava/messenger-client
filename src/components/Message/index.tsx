import { Message as MessageType } from '@/graphql/types'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { formatTime, is } from '@/util/functions'
import { Skeleton, UserIcon } from '@components'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { ConversationContext } from '../Context/ConversationContext'
import useSubscribeToMessages from '@/hooks/useSubscribeToMessages'

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
					{sender.username} <span className='text-zinc-400 text-sm'>{formatTime(createdAt)}</span>
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

export const Messages = () => {
	const { messages, loading } = useSubscribeToMessages()
	const { ref } = useAutoScroll<HTMLDivElement>({ deps: [messages] })

	return (
		<div ref={ref} className='p-2 xl:p-4 [&>*:not(:first-child)]:mt-4 overflow-auto h-full'>
			{loading && <Skeleton count={10} className='h-full col overflow-hidden [&>*:nth-child(even)]:self-end ' childrenClassName='w-[45%] h-[36px] rounded mt-2' />}
			{messages?.map((message) => <Message data={message} key={message.id} />)}
		</div>
	)
}
