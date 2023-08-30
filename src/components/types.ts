import { Message, SearchedUser } from '@/graphql/types'

export interface ItemWithIconProps {
	name?: string
	message?: string
	time?: string
	onClick?: () => void
	id?: string
	hasUpdate?: boolean
}

export interface MessageProps {
	data: Message
}

export interface SkeletonProps {
	className: string
	childrenClassName: string
	count: number
}

export interface StartConversationButtonProps {
	toggle: () => void
}

export interface UserIconProps {
	right?: boolean
	notification?: boolean
}

export interface UserTagProps {
	user: SearchedUser
}
