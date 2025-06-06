import { is } from '@/util/functions'
import { Logout, StartConversationForm, ConversationList, ItemWithIcon } from '@components'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { StartConversationContextProvider } from '../../context/StartConversationContext'

export const ChatList = () => {
	const { showChatList, toggleConversationForm } = useContext(AppContext)
	const { data: userData } = useSession()

	return (
		<div id='users' className={`${is(!showChatList, 'hidden')} py-5 ml-5 pr-0 overflow-hidden relative col gap-3 float-left chat-list-responsive h-full`}>
			<div className='flex items-center gap-3'>
				<ItemWithIcon name={userData?.user.username} />
			</div>
			<button onClick={() => toggleConversationForm(true)} className='font-medium outline-none text-zinc-200 bg-indigo-500 px-3 py-2 rounded'>
				Start a conversation
			</button>
			<ConversationList />
			<Logout />
			<StartConversationContextProvider>
				<StartConversationForm />
			</StartConversationContextProvider>
		</div>
	)
}
