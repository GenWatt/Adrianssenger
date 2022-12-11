import { atom } from 'recoil'
import { Message } from '../global'

interface MessagesState {
  messages: Message[]
  unseenMessages: Message[]
}

export const initialMessagesValue: MessagesState = { messages: [], unseenMessages: [] }

export const messagesState = atom<MessagesState>({
  key: 'messages',
  default: initialMessagesValue,
})
