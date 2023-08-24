import { is } from '@/util/functions'
import { Logout, StartConversationForm, ConversationList, ItemWithIcon } from '@components'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { StartConversationContextProvider } from '../Context/StartConversationContext'

export const ChatList = () => {
	const { showChatList, toggleConversationForm } = useContext(AppContext)
	const { data: userData } = useSession({ required: true })

	return (
		<div id='users' className={`${is(!showChatList, 'hidden')} overflow-hidden relative col gap-3 float-left chat-list-responsive h-full bg-zinc-800 border-r-[1px] border-slate-600`}>
			<div className='flex items-center bg-slate-800 gap-3 border-b-[1px] border-slate-600'>
				<ItemWithIcon name={userData?.user.username} />
			</div>
			<button onClick={() => toggleConversationForm(true)} className='mx-3 font-light outline-none text-zinc-200 bg-zinc-900 px-3 py-1 rounded'>
				Start a conversation
			</button>
			<StartConversationContextProvider>
				<StartConversationForm />
			</StartConversationContextProvider>
			<ConversationList />
			<Logout />
		</div>
	)
}
