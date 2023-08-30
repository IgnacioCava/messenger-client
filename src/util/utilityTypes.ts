import { Mutation, Query, Subscription } from '@/graphql/types'

type AllOps = Query & Mutation & Subscription

export type OpReturnType<PropName extends keyof AllOps> = {
	[P in PropName]: AllOps[P]
}
