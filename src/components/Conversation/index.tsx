import { is } from '@/util/functions'
import { UserIcon, Message, SendMessage } from '@components'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'

export const Conversation = () => {
	//const hideConversation = is(list, 'hidden')
	const { showChatList, toggleChatList } = useContext(AppContext)

	return (
		<div id='conversation' className={`h-full col s-full test-outlin bg-zinc-900 overflow-hidden`}>
			<div className='flex items-center px-3 py-2 bg-slate-800 gap-3'>
				<button className='block lg:hidden aspect-square w-10' onClick={() => toggleChatList()}>
					{is(showChatList, '<-', '->')}
				</button>
				<UserIcon />
				Other user
			</div>
			<div className='p-2 xl:p-4 [&>*:not(:first-child)]:mt-4 overflow-auto h-full'>
				{[...Array(20)].map((_, index) => (
					<Message key={index} direction={Math.random() < 0.5 ? 'left' : 'right'} />
				))}
			</div>
			<SendMessage />
		</div>
	)
}
