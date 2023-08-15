import DefaultUserIcon from '@assets/default-user.png'
import Image from 'next/image'
import { is } from '@/util/functions'

export const UserIcon = ({ right = false }: { right?: boolean }) => {
	return <Image src={DefaultUserIcon} alt={'user icon'} className={`h-10 w-10 ${is(right, 'order-last')}`} />
}
