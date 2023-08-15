import { is } from '@/util/functions'
import { UserIcon, Message, SendMessage } from '@components'

export const Conversation = ({ toggleList, list }: { toggleList: () => void; list: boolean }) => {
	//const hideConversation = is(list, 'hidden')
	return (
		<div id='conversation' className={`h-full col s-full test-outlin bg-zinc-900 overflow-hidden`}>
			<div className='flex items-center px-3 py-2 bg-slate-800 gap-3'>
				<button className='block lg:hidden aspect-square w-10' onClick={toggleList}>
					{is(list, '<-', '->')}
				</button>
				<UserIcon />
				Other user
			</div>
			<div className='p-2 xl:p-4 [&>*:not(:first-child)]:mt-4 overflow-auto h-full'>
				{[...Array(20)].map(() => (
					<Message direction={Math.random() < 0.5 ? 'left' : 'right'} />
				))}
			</div>
			<SendMessage />
		</div>
	)
}
