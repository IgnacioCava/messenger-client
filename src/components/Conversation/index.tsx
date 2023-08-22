import { is, usernames, formatTime } from '@/util/functions'
import { UserIcon, Message, SendMessage, ItemWithIcon } from '@components'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { useSession } from 'next-auth/react'

export const Conversation = () => {
	const { showChatList, toggleChatList, selectedConversation: convo, toggleConversationForm, showConversationForm } = useContext(AppContext)
	const { data: userData } = useSession()

	return (
		<div id='conversation' className={`h-full col s-full test-outlin bg-zinc-900 overflow-hidden`}>
			{convo ? (
				<>
					<div className='flex items-center px-3 py-2 bg-slate-800 gap-3 border-b-[1px] border-slate-600'>
						<button className='block lg:hidden aspect-square w-10' onClick={() => toggleChatList()}>
							{is(showChatList, '<-', '->')}
						</button>
						<ItemWithIcon key={convo.id} name={usernames(convo.users, userData?.user.id)} />
					</div>
					<div className='p-2 xl:p-4 [&>*:not(:first-child)]:mt-4 overflow-auto h-full'>
						{[...Array(20)].map((_, index) => (
							<Message key={index} direction={Math.random() < 0.5 ? 'left' : 'right'} />
						))}
					</div>
					<SendMessage />
				</>
			) : (
				<div className='text-center m-auto'>
					<h1 className='text-2xl mb-4'>Messenger App</h1>
					<button onClick={() => toggleConversationForm(true)} className={`bg-zinc-800 py-2 px-4 rounded ${is(showConversationForm, 'opacity-0 pointer-events-none')} transition-opacity`}>
						Click here to start a conversation
					</button>
				</div>
			)}
		</div>
	)
}
