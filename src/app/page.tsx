'use client'

import { useSession } from 'next-auth/react'

import Auth from '@/components/Auth'
import Chat from '@/components/Chat'
import Image from 'next/image'
import a from '@assets/default-user.png'

const SearchUser = () => {
	return <input type='text' placeholder='Search user' className='mx-3 font-light outline-none text-zinc-200 placeholder:text-zinc-400 bg-zinc-900 px-3 py-1 rounded' />
}

const Logout = () => {
	return <button className='mx-3 mb-3 rounded p-1 bg-slate-700'>Logout</button>
}

const User = ({ name = 'test user', message = 'some random message', time = '3:12 PM' }: { name?: string; message?: string; time?: string }) => {
	return (
		<div className='w-full flex p-3 hover:bg-zinc-700 gap-2 items-center'>
			<Image src={a} alt={'a'} className='h-10 w-auto' />
			<div id='content' className='flex flex-col overflow-hidden w-full'>
				<div className='flex justify-between w-full items-center'>
					<p className='text-base font-normal text-zinc-300 overflow-hidden text-ellipsis w-3/4'>{name}</p>
					<p className='text-xs min-w-fit text-zinc-400 w-1/4 text-right'>{time}</p>
				</div>

				<p className='text-sm font-light text-zinc-400 text-ellipsis whitespace-nowrap overflow-hidden'>{message}</p>
			</div>
		</div>
	)
}

const SendMessage = () => {
	return (
		<div className='w-full p-3 bg-zinc-800'>
			<textarea
				placeholder='Send message'
				className='w-full outline-none font-light bg-zinc-900 rounded px-3 py-1 resize-none max-h-[100px] block h-8 overflow-y-hidden'
				onChange={(e) => {
					e.target.style.height = '0'
					e.target.style.height = e.target.scrollHeight + 'px'
				}}
			/>
		</div>
	)
}

const Conversation = () => {
	return (
		<div className='h-full flex flex-col'>
			<div className='flex flex-row items-center px-3 py-2 bg-slate-800 gap-3'>
				<Image src={a} alt={'a'} className='h-10 w-10' /> Other user
			</div>
			<div className='p-4 [&>*:not(:first-child)]:mt-4 overflow-auto h-full'>
				{[...Array(20)].map(() => (
					<Message direction={Math.random() < 0.5 ? 'left' : 'right'} />
				))}
			</div>
			<SendMessage />
		</div>
	)
}

const Message = ({ direction }: { direction: 'left' | 'right' }) => {
	return (
		<div className={`flex flex-row gap-2 ${direction === 'right' && 'justify-end'}`}>
			<Image src={a} alt={'a'} className={`h-10 w-auto ${direction === 'right' && 'order-last'}`} />
			<div className={`flex flex-col ${direction === 'right' && 'items-end'}`}>
				<p>
					{direction === 'right' ? 'You' : 'Other user'} <span>3:13 PM</span>
				</p>
				<div className={`w-full lg:w-1/2 xl:min-w-[350px] clamp p-2 rounded ${direction === 'right' ? 'bg-sky-900' : 'bg-zinc-700'} text-sm`}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nec sollicitudin dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum
					sit amet porta odio. Nunc sit amet erat nisl. Nullam at est elit. Nullam blandit libero nisi, dictum lobortis nunc sagittis sed. Donec sollicitudin arcu sapien, a rutrum est
				</div>
			</div>
		</div>
	)
}

export default function Home() {
	const { data: session, status } = useSession()

	if (status === 'loading') return null
	// return <div className='flex flex-col'>{session?.user.username ? <Chat /> : <Auth />}</div>
	return (
		<div className='flex flex-row w-full 2xl:w-4/5 2xl:max-w-[1400px] xl:w-full h-full m-auto'>
			<div id='users' className={`flex flex-col gap-3 float-left min-w-[300px] max-w-[400px] w-1/4 h-full bg-zinc-800 border-r-[1px] border-slate-600`}>
				<div className='flex flex-row items-center px-3 py-2 bg-slate-800 gap-3'>
					<Image src={a} alt={'a'} className='h-10 w-10' /> Current user
				</div>
				<SearchUser />
				<div className='w-full h-full overflow-auto space-children'>
					<User name='WWWWWWWWWWWWWWWWWWWWWWWWWWWW' message='WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' />
					{[...Array(20)].map(() => (
						<User />
					))}
				</div>
				<Logout />
			</div>
			<div id='messages' className={`flex flex-col w-full h-full test-outlin bg-zinc-900`}>
				<Conversation />
			</div>
		</div>
	)
}
