import { Conversation, SearchedUser } from '@/graphql/types'
import { ApolloError } from '@apollo/client'
import { Dispatch, ReactNode, RefObject, SetStateAction, KeyboardEvent } from 'react'

export interface ContextProps {
	children: ReactNode
}

export type DisplayableUser = SearchedUser & { display?: boolean }

export interface StartConversationContextValues {
	foundUsers: DisplayableUser[] | undefined | null
	loading: boolean
	error: ApolloError | undefined
	ready: boolean
	loadingCreateConversation: boolean
	searchUsers: (username: string) => void
	selectedUsers: SearchedUser[]
	addUser: (addedUser: SearchedUser) => void
	removeUser: (removedUserId: SearchedUser['id']) => void
	closeForm: () => void
	onCreateConversation: () => void
	formRef: RefObject<HTMLFormElement> | null
}

export interface ConversationContextValues {
	message: string
	setMessage: Dispatch<SetStateAction<string>>
	onSendMessage: () => Promise<void>
	onKeyDown: <T extends HTMLElement>(event: KeyboardEvent<T>) => Promise<void>
	elementRef: RefObject<HTMLTextAreaElement> | null
}

export interface AppContextValues {
	showChatList: boolean
	toggleChatList: (force?: boolean) => void
	showConversationForm: boolean
	toggleConversationForm: (force?: boolean) => void
	conversations: Conversation[] | undefined
	conversationId: string
	selectedConversation: Conversation | null
	setSelectedConversation: (conversation: Conversation | null) => void
	loading: boolean
	onDeleteConversation: (conversationId: string) => Promise<void>
}
