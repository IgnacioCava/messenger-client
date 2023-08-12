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
}

export type CreateUsernameResponse = {
	__typename?: 'CreateUsernameResponse'
	error?: Maybe<Scalars['String']['output']>
	success?: Maybe<Scalars['Boolean']['output']>
}

export type Mutation = {
	__typename?: 'Mutation'
	createUsername?: Maybe<CreateUsernameResponse>
}

export type MutationCreateUsernameArgs = {
	username: Scalars['String']['input']
}

export type Query = {
	__typename?: 'Query'
	searchUsers?: Maybe<Array<Maybe<User>>>
}

export type QuerySearchUsersArgs = {
	username?: InputMaybe<Scalars['String']['input']>
}

export type Subscription = {
	__typename?: 'Subscription'
	userCreated?: Maybe<User>
}

export type User = {
	__typename?: 'User'
	id?: Maybe<Scalars['String']['output']>
	username?: Maybe<Scalars['String']['output']>
}
