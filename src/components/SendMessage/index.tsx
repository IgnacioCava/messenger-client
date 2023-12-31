import { useContext } from 'react'
import { ConversationContext } from '../../context/ConversationContext'

export const SendMessage = () => {
	const { message, setMessage, onKeyDown, elementRef } = useContext(ConversationContext)

	return (
		<div className='w-full p-3 bg-zinc-800'>
			<textarea
				ref={elementRef}
				onKeyDown={onKeyDown}
				value={message}
				placeholder='Send message'
				className='w-full outline-none font-light bg-zinc-900 rounded px-3 py-1 resize-none max-h-[100px] block h-8 overflow-y-hidden'
				onChange={({ target }) => setMessage(target.value)}
			/>
		</div>
	)
}
