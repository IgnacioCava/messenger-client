import { is } from '@/util/functions'
import { ItemWithIcon, Logout, StartConversationForm, UserIcon } from '@components'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { StartConversationContextProvider } from '../Context/StartConversationContext'

export const ChatList = () => {
	const { showChatList, toggleConversationForm, conversations, onOpenConversation } = useContext(AppContext)
	const { data: userData } = useSession()

	return (
		<div id='users' className={`${is(!showChatList, 'hidden')} overflow-hidden relative col gap-3 float-left chat-list-responsive h-full bg-zinc-800 border-r-[1px] border-slate-600`}>
			<div className='flex items-center px-3 py-2 bg-slate-800 gap-3'>
				<UserIcon /> {userData?.user.username}
			</div>
			<button onClick={() => toggleConversationForm(true)} className='mx-3 font-light outline-none text-zinc-200 placeholder:text-zinc-400 bg-zinc-900 px-3 py-1 rounded'>
				Start a conversation
			</button>
			<StartConversationContextProvider>
				<StartConversationForm />
			</StartConversationContextProvider>
			{/* <SearchUser /> */}
			<div className='s-full overflow-auto'>
				{conversations?.map(({ users, id }) => {
					const userList = users.map(({ user }) => user.username).join(', ')
					return <ItemWithIcon key={id} id={id} name={userList} onClick={() => onOpenConversation(id)} />
				})}
			</div>
			<Logout />
		</div>
	)
}
