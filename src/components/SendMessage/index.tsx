import { useContext } from 'react'
import { ConversationContext } from '../../context/ConversationContext'

export const SendMessage = () => {
	const { message, setMessage, onKeyDown, elementRef } = useContext(ConversationContext)

	return (
		<div className='w-full p-4 bg-gray-50 border-gray-200 border-t-2'>
			<textarea
				ref={elementRef}
				onKeyDown={onKeyDown}
				value={message}
				name='message'
				placeholder='Send message'
				className='w-full text-slate-800 outline-none font-medium bg-transparent rounded px-3 py-1 resize-none max-h-[200px] block h-8 caret-inherit overflow-auto'
				onChange={({ target }) => setMessage(target.value)}
			/>
		</div>
	)
}
