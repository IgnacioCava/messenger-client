import { is, usernames } from '@/util/functions'
import { ItemWithIcon, Messages, SendMessage } from '@components'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

export const Conversation = () => {
	const { showChatList, toggleChatList, selectedConversation: convo, toggleConversationForm, showConversationForm, onDeleteConversation } = useContext(AppContext)
	const { data: userData } = useSession()
	return (
		<div id='conversation' className={`h-full col s-full test-outlin overflow-hidden p-5`}>
			<div className='bg-gray-50 flex flex-col flex-1 overflow-hidden rounded-xl'>
				{convo ? (
					<>
						<div className='flex items-centergap-3 border-b-2 border-gray-200'>
							<button className='block lg:hidden aspect-square w-10 text-white bg-indigo-500' onClick={() => toggleChatList()}>
								{is(showChatList, '<-', '->')}
							</button>
							<ItemWithIcon key={convo.id} name={usernames(convo.users, userData?.user.id)} />
							<button className='bg-indigo-500 p-2' onClick={() => onDeleteConversation(convo.id)}>
								Delete conversation
							</button>
						</div>
						<Messages />
						<SendMessage />
					</>
				) : (
					<div className='text-center m-auto'>
						<h1 className='text-2xl mb-4 text-gray-700'>Messenger App</h1>
						<button
							onClick={() => toggleConversationForm(true)}
							className={`bg-indigo-500 py-2 px-4 rounded ${is(showConversationForm, 'opacity-0 pointer-events-none')} transition-opacity`}
						>
							Click here to start a conversation
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
