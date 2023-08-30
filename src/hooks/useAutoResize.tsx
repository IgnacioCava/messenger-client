import { autoResize } from '@/util/functions'
import { useEffect, useRef } from 'react'

interface useAutoResizeProps {
	deps: unknown[]
}

export const useAutoResize = ({ deps }: useAutoResizeProps) => {
	const elementRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		elementRef.current && autoResize(elementRef.current)
	}, [...deps])

	return {
		ref: elementRef
	}
}
