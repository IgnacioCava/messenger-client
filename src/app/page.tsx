import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import { SingInGoogleButton, SingOutButton } from '../components/buttons'

export default async function Home() {
	const session = await getServerSession(authOptions)
	console.log(session)

	return (
		<div className='flex flex-col'>
			<p className='break-all'>{session?.user?.email}</p>
			{session ? <SingOutButton /> : <SingInGoogleButton />}
		</div>
	)
}
