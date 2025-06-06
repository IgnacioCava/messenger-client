import { is } from '@/util/functions'
import { SearchUser, UserList, UserTags } from '@components'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { StartConversationContext } from '../../context/StartConversationContext'
import useEnterCreatedConversation from '@/hooks/useEnterCreatedConversation'

export const StartConversationForm = () => {
	const { showConversationForm: isOpen } = useContext(AppContext)
	const { closeForm, onCreateConversation, selectedUsers } = useContext(StartConversationContext)

	useEnterCreatedConversation()

	return (
		<div
			className={`col z-10 ${is(isOpen, 'translate-x-0', 'translate-x-[-100%]')} rounded-xl overflow-hidden transition duration-300 absolute chat-list-responsive h-[calc(100%-40px)] bg-gray-50`}
		>
			<span className={`${is(isOpen, 'translate-x-0 opacity-100 duration-700', 'translate-x-[-50%] opacity-0 duration-500')} transition text-zinc-800 py-3`}>
				<button onClick={closeForm} className='mx-2 h-10 w-10'>
					{'<-'}
				</button>
				Start a conversation
			</span>
			<SearchUser />
			{selectedUsers.length ? (
				<button onClick={onCreateConversation} className='m-3 p-2 bg-indigo-500 rounded-xl'>
					Start
				</button>
			) : null}

			<div className='h-full overflow-hidden'>
				<UserTags />
				<UserList />
			</div>
		</div>
	)
}
