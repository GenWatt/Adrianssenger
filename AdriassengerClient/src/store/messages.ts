import { atom } from 'recoil'
import { Message } from '../global'

interface MessagesState {
  messages: Message[]
}

export const initialMessagesValue: MessagesState = { messages: [] }

export const messagesState = atom<MessagesState>({
  key: 'messages',
  default: initialMessagesValue,
})
