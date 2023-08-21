export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string }
	String: { input: string; output: string }
	Boolean: { input: boolean; output: boolean }
	Int: { input: number; output: number }
	Float: { input: number; output: number }
	Date: { input: Date; output: Date }
}

export type Conversation = {
	__typename?: 'Conversation'
	createdAt: Scalars['Date']['output']
	id: Scalars['String']['output']
	lastMessage?: Maybe<Message>
	updatedAt: Scalars['Date']['output']
	users: Array<ConversationParticipant>
}

export type ConversationParticipant = {
	__typename?: 'ConversationParticipant'
	hasSeenLatestMessage: Scalars['Boolean']['output']
	id: Scalars['String']['output']
	user: User
}

export type CreateConversationResponse = {
	__typename?: 'CreateConversationResponse'
	conversationId: Scalars['String']['output']
}

export type CreateUsernameResponse = {
	__typename?: 'CreateUsernameResponse'
	error?: Maybe<Scalars['String']['output']>
	success?: Maybe<Scalars['Boolean']['output']>
}

export type Message = {
	__typename?: 'Message'
	body: Scalars['String']['output']
	createdAt: Scalars['Date']['output']
	id: Scalars['String']['output']
	sender: User
}

export type Mutation = {
	__typename?: 'Mutation'
	createConversation?: Maybe<CreateConversationResponse>
	createUsername?: Maybe<CreateUsernameResponse>
}

export type MutationCreateConversationArgs = {
	participantIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type MutationCreateUsernameArgs = {
	username: Scalars['String']['input']
}

export type Query = {
	__typename?: 'Query'
	conversations: Array<Conversation>
	searchUsers?: Maybe<Array<SearchedUser>>
}

export type QuerySearchUsersArgs = {
	username?: InputMaybe<Scalars['String']['input']>
}

export type SearchedUser = {
	__typename?: 'SearchedUser'
	id: Scalars['String']['output']
	username: Scalars['String']['output']
}

export type Subscription = {
	__typename?: 'Subscription'
	conversationCreated: Conversation
	userCreated?: Maybe<User>
}

export type User = {
	__typename?: 'User'
	email: Scalars['String']['output']
	emailVerified: Scalars['Boolean']['output']
	id: Scalars['String']['output']
	image: Scalars['String']['output']
	username: Scalars['String']['output']
}
