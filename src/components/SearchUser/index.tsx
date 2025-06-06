import { FormEventHandler, useContext, useState } from 'react'
import { StartConversationContext } from '../../context/StartConversationContext'
import { SearchIcon, Spinner } from '../svgComponents'

export const SearchUser = () => {
	const [username, setUsername] = useState('')

	const { searchUsers, loading, error, formRef } = useContext(StartConversationContext)

	const onSubmit: FormEventHandler = (event) => {
		event.preventDefault()
		if (username) searchUsers(username)
	}

	return (
		<>
			<form ref={formRef} onSubmit={onSubmit} className='flex bg-gray-200 p-1 rounded-xl mx-3'>
				<input
					onChange={({ target }) => setUsername(target.value)}
					type='text'
					placeholder='Search user'
					className='font-normal outline-none text-zinc-800 bg-transparent placeholder:text-gray-500 pl-3 py-1 rounded w-full'
				/>
				<button type='submit' className=' px-3'>
					{loading ? <Spinner className='h-4 w-4' /> : <SearchIcon className='fill-slate-400 h-4 w-4' />}
				</button>
			</form>
			{error && <span className='mx-3'>{error.message}</span>}
		</>
	)
}
