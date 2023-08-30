import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const useConversationQuery = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const addQuery = (query: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(query, value)
		router.replace(`${pathname}?${params}`)
	}

	const resetQuery = () => router.replace('/')

	useEffect(() => {
		resetQuery()
	}, [])

	return { addQuery, resetQuery }
}
