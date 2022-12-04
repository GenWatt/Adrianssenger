import { useRecoilState } from 'recoil'
import { Message } from '../../global'
import { messagesState } from '../../store/messages'
import useFetch from '../../hooks/useFetch'

export default function useMessage() {
  const { request } = useFetch()
  const [messagesStore, setMessagesStore] = useRecoilState(messagesState)

  const addMessage = (message: Message) => {
    setMessagesStore((prev) => ({ messages: [...prev.messages, message] }))
  }

  const setMessages = (messages: Message[]) => {
    setMessagesStore({ messages })
  }

  const loadMessages = async (userId: number, receiverId: number) => {
    const response = await request<Message[]>('/Messages?userId=' + userId + '&receiverId=' + receiverId)
    return response
  }

  return { addMessage, setMessages, loadMessages, messagesStore }
}
