import { ConversationParticipant } from '@/graphql/types'
import { formatRelative } from 'date-fns'
import { enUS } from 'date-fns/locale'

/**
 * If `condition` is true, return `className`, else return `other` or an empty string
 */
export const is = (condition: boolean, className: string, other?: string) => (condition ? className : other || '')

/**
 * Return the username of all users whose id is different from `currentUserId`.
 * @returns A string of comma-separated usernames (e.g., "username1, username2").
 */
export const usernames = (users: ConversationParticipant[], currentUserId?: string) =>
	users
		.filter((user) => user.id !== currentUserId)
		.map(({ user }) => user.username)
		.join(', ')

/**
 * Format time based on a `locale` token object
 * @returns A string following the given object (e.g. {yesterday: "'Yesterday at' p"} === "Yesterday at 4:10 PM").
 */
export const formatTime = (updatedAt: Date, locale?: Record<string, string>) => {
	const formatRelativeLocale = {
		lastWeek: 'eeee, p',
		yesterday: "'Yesterday', p",
		today: 'p',
		other: 'MM/dd/yy'
	}

	type Token = keyof typeof locale | keyof typeof formatRelativeLocale

	return formatRelative(new Date(updatedAt), new Date(), {
		locale: {
			...enUS,
			formatRelative: (token: Token) => locale?.[token] || formatRelativeLocale[token]
		}
	})
}
