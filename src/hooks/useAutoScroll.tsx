import { useEffect, useRef } from 'react'

interface useAutoScrollProps {
	deps: unknown[]
}

export const useAutoScroll = <T extends HTMLElement>({ deps }: useAutoScrollProps) => {
	const messagesContainer = useRef<T>(null)

	useEffect(() => {
		if (deps) messagesContainer.current?.scrollTo({ top: messagesContainer.current?.scrollHeight })
	}, [...deps])

	return {
		ref: messagesContainer
	}
}
