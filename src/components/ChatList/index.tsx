import { is } from '@/util/functions'
import { Logout, SearchUser, StartConversationButton, StartConversationForm, User, UserIcon } from '@components'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { StartConversationContextProvider } from '../Context/StartConversationContext'

export const ChatList = () => {
	const { showChatList, toggleConversationForm } = useContext(AppContext)

	return (
		<div id='users' className={`${is(!showChatList, 'hidden')} overflow-hidden relative col gap-3 float-left chat-list-responsive h-full bg-zinc-800 border-r-[1px] border-slate-600`}>
			<div className='flex items-center px-3 py-2 bg-slate-800 gap-3'>
				<UserIcon /> Current user
			</div>
			<button onClick={() => toggleConversationForm(true)} className='mx-3 font-light outline-none text-zinc-200 placeholder:text-zinc-400 bg-zinc-900 px-3 py-1 rounded'>
				Start a conversation
			</button>
			<StartConversationContextProvider>
				<StartConversationForm />
			</StartConversationContextProvider>
			{/* <SearchUser /> */}
			<div className='s-full overflow-auto space-children'>
				<User name='WWWWWWWWWWWWWWWWWWWWWWWWWWWW' message='WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' />
				{[...Array(20)].map((_, index) => (
					<User key={index} />
				))}
			</div>
			<Logout />
		</div>
	)
}
