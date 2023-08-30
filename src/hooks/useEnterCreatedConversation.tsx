import { AppContext } from '@/context/AppContext'
import { useContext, useEffect } from 'react'
import useSelectConversation from './useSelectConversation'

const useEnterCreatedConversation = () => {
	const { conversations, conversationId } = useContext(AppContext)

	const { onSelectConversation } = useSelectConversation()

	useEffect(() => {
		const conversation = conversations?.find((conv) => conv.id === conversationId)
		if (!conversation) return
		onSelectConversation(conversation, false)
	}, [conversationId, conversations])
}

export default useEnterCreatedConversation
