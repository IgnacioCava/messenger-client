import { ItemWithIcon } from '@components'
import { useContext } from 'react'
import { StartConversationContext } from '../../context/StartConversationContext'

export const UserList = () => {
	const { foundUsers, ready, addUser } = useContext(StartConversationContext)

	return (
		<div className='s-full overflow-auto space-children p-3'>
			{foundUsers?.length === 0 ? (
				<p className='py-10 text-center'>No users found</p>
			) : (
				ready &&
				foundUsers?.map((user) => {
					return user.display === false ? null : <ItemWithIcon id={user.id} key={user.id} onClick={() => addUser(user)} name={user.username} />
				})
			)}
		</div>
	)
}
