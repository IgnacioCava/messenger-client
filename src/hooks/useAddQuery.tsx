import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const useAddQuery = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const addQuery = (query: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(query, value)
		router.replace(`${pathname}?${params}`)
	}

	return { addQuery }
}