import { ReactNode, createContext, useState } from 'react'

interface AppContextValues {
	showChatList: boolean
	toggleChatList: (force?: boolean) => void
	showConversationForm: boolean
	toggleConversationForm: (force?: boolean) => void
}

const defaultContext: AppContextValues = {
	showChatList: true,
	toggleChatList: () => {},
	showConversationForm: false,
	toggleConversationForm: () => {}
}

export const AppContext = createContext<AppContextValues>(defaultContext)

interface AppContextProps {
	children: ReactNode
}

export const AppContextProvider: React.FC<AppContextProps> = ({ children }) => {
	const [showChatList, toggleChatList] = useState(true)
	const [showConversationForm, toggleConversationForm] = useState(false)

	const value: AppContextValues = {
		showChatList,
		showConversationForm,
		toggleChatList: (force) => toggleChatList(force ?? !showChatList),
		toggleConversationForm: (force) => toggleConversationForm(force ?? !showChatList)
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
