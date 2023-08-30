import { FormEventHandler, useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import { StartConversationContext } from '../Context/StartConversationContext'
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
			<form ref={formRef} onSubmit={onSubmit} className='flex bg-zinc-900 border border-slate-600 rounded mx-3'>
				<input
					onChange={({ target }) => setUsername(target.value)}
					type='text'
					placeholder='Search user'
					className='font-light outline-none text-zinc-200 bg-transparent placeholder:text-zinc-400 pl-3 py-1 rounded w-full'
				/>
				<button type='submit' className=' px-3'>
					{loading ? <Spinner className='h-4 w-4' /> : <SearchIcon className='fill-slate-400 h-4 w-4' />}
				</button>
			</form>
			{error && <span className='mx-3'>{error.message}</span>}
		</>
	)
}
