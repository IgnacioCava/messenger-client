import {UserIcon} from '@components'

export const User = ({ name = 'test user', message = 'some random message', time = '3:12 PM' }: { name?: string; message?: string; time?: string }) => {
	return (
		<div className='w-full flex p-3 hover:bg-zinc-700 gap-2 items-center'>
			<UserIcon />
			<div id='content' className='col overflow-hidden w-full'>
				<div className='flex justify-between w-full items-center'>
					<p className='text-base font-normal text-zinc-300 overflow-hidden text-ellipsis w-3/4'>{name}</p>
					<p className='text-xs min-w-fit text-zinc-400 w-1/4 text-right'>{time}</p>
				</div>

				<p className='text-sm font-light text-zinc-400 text-ellipsis whitespace-nowrap overflow-hidden'>{message}</p>
			</div>
		</div>
	)
}