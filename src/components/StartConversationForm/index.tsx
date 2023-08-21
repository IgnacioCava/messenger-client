import { is } from '@/util/functions'
import { SearchUser, ItemWithIcon } from '@components'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { StartConversationContext } from '../Context/StartConversationContext'
import { Close } from '../svgComponents'

export const StartConversationForm = () => {
	const { showConversationForm: isOpen } = useContext(AppContext)
	const { foundUsers, selectedUsers, addUser, removeUser, closeForm, ready, onCreateConversation } = useContext(StartConversationContext)

	return (
		<div className={`col ${is(isOpen, 'translate-x-0', 'translate-x-[-100%]')} overflow-hidden transition duration-300 absolute chat-list-responsive h-full bg-zinc-800 pt-[56px]`}>
			<span className={`${is(isOpen, 'translate-x-0 opacity-100 duration-700', 'translate-x-[-50%] opacity-0 duration-500')} transition `}>
				<button onClick={closeForm} className='mx-2 h-10 w-10'>
					{'<-'}
				</button>
				Start a conversation
			</span>
			<SearchUser />
			<button onClick={onCreateConversation} className='m-3 p-1 bg-sky-700 rounded'>
				Start
			</button>

			<div className='h-full overflow-hidden'>
				{!!selectedUsers.length && (
					<div id='tags' className='flex flex-wrap gap-2 px-3 pb-0 max-h-[150px] overflow-auto mb-3'>
						{selectedUsers.map((user) => (
							<span key={user.id} className='py-1 px-2 rounded-sm bg-slate-700 flex items-center gap-2 h-8'>
								<span>{user.username}</span>
								<Close onClick={() => removeUser(user.id)} className='w-5 h-5 fill-white cursor-pointer' />
							</span>
						))}
					</div>
				)}
				<div className='s-full overflow-auto space-children'>
					{foundUsers?.length === 0 ? (
						<p className='py-10 text-center'>No users found</p>
					) : (
						ready &&
						foundUsers?.map((user) => {
							return user.display === false ? null : (
								<div key={user.id} onClick={() => addUser(user)}>
									<ItemWithIcon id={user.id} name={user.username} />
								</div>
							)
						})
					)}
				</div>
			</div>
		</div>
	)
}
