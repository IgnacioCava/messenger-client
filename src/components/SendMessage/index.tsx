export const SendMessage = () => {
	return (
		<div className='w-full p-3 bg-zinc-800'>
			<textarea
				placeholder='Send message'
				className='w-full outline-none font-light bg-zinc-900 rounded px-3 py-1 resize-none max-h-[100px] block h-8 overflow-y-hidden'
				onChange={({ target }) => {
					target.style.height = '0'
					target.style.height = target.scrollHeight + 'px'
				}}
			/>
		</div>
	)
}
