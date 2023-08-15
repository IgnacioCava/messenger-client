export const StartConversationButton = ({ toggle }: { toggle: () => void }) => {
	return (
		<button onClick={toggle} className='mx-3 font-light outline-none text-zinc-200 placeholder:text-zinc-400 bg-zinc-900 px-3 py-1 rounded'>
			Start a conversation
		</button>
	)
}
