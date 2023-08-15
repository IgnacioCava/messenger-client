import { is } from '@/util/functions'
import { SearchUser, User } from '@components'

export const StartConversationForm = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
	return (
		<div className={`col ${is(isOpen, 'translate-x-0', 'translate-x-[-100%]')} transition duration-300 absolute chat-list-responsive h-full bg-zinc-800 pt-[56px]`}>
			<span className={`${is(isOpen, 'translate-x-0 opacity-100 duration-700', 'translate-x-[-50%] opacity-0 duration-500')} transition `}>
				<button onClick={toggle} className='mx-2 h-10 w-10'>
					{'<-'}
				</button>
				Start a conversation
			</span>
			<SearchUser />
			<div id='tags' className='flex flex-wrap gap-2 px-3 mt-3 pb-0 max-h-[200px] overflow-auto'>
				{[...Array(15)].map(() => (
					<span className='py-1 px-2 rounded-sm bg-slate-700 flex items-center gap-2'>
						<span>{Math.random().toFixed(Math.random() * 10)}</span>
						<button className='flex items-center justify-center border h-4 w-4 rounded-[50%] font-mono'>X</button>
					</span>
				))}
			</div>
			<div className='s-full overflow-auto space-children mt-3'>
				<User name='WWWWWWWWWWWWWWWWWWWWWWWWWWWW' message='WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' />
				{[...Array(20)].map(() => (
					<User />
				))}
			</div>
			<button className='m-3 p-1 bg-sky-700 rounded'>Start</button>
		</div>
	)
}
