import { is } from '@/util/functions'
import { Logout, SearchUser, StartConversationButton, StartConversationForm, User, UserIcon } from '@components'

export const ChatList = ({ list, toggle, show }: { list: boolean; toggle: () => void; show: boolean }) => {
	return (
		<div id='users' className={`${is(list, 'hidden')} overflow-hidden relative col gap-3 float-left chat-list-responsive h-full bg-zinc-800 border-r-[1px] border-slate-600`}>
			<div className='flex items-center px-3 py-2 bg-slate-800 gap-3'>
				<UserIcon /> Current user
			</div>
			<StartConversationButton toggle={toggle} />
			<StartConversationForm isOpen={show} toggle={toggle} />
			<SearchUser />
			<div className='s-full overflow-auto space-children'>
				<User name='WWWWWWWWWWWWWWWWWWWWWWWWWWWW' message='WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' />
				{[...Array(20)].map(() => (
					<User />
				))}
			</div>
			<Logout />
		</div>
	)
}
