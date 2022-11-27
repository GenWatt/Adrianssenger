import { atom, selector } from 'recoil'
import { Message } from '../global'

interface MessagesState {
  messages: Message[]
}

const initialMessagesValue: Message[] = []

export const messagesState = atom<MessagesState>({
  key: 'messages',
  default: {
    messages: initialMessagesValue,
  },
})
