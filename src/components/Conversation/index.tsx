import { is, usernames, formatTime } from '@/util/functions'
import { UserIcon, Message, SendMessage, ItemWithIcon, Messages } from '@components'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { useSession } from 'next-auth/react'

export const Conversation = () => {
	const { showChatList, toggleChatList, selectedConversation: convo, toggleConversationForm, showConversationForm, onDeleteConversation } = useContext(AppContext)
	const { data: userData } = useSession()

	return (
		<div id='conversation' className={`h-full col s-full test-outlin bg-zinc-900 overflow-hidden`}>
			{convo ? (
				<>
					<div className='flex items-center bg-slate-800 gap-3 border-b-[1px] border-slate-600'>
						<button className='block lg:hidden aspect-square w-10' onClick={() => toggleChatList()}>
							{is(showChatList, '<-', '->')}
						</button>
						<ItemWithIcon key={convo.id} name={usernames(convo.users, userData?.user.id)} />
						<button onClick={() => onDeleteConversation(convo.id)}>DELETE</button>
					</div>
					<Messages conversationId={convo.id} />
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
