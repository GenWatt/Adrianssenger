import { useRecoilState } from 'recoil'
import { Message } from '../../global'
import { messagesState } from '../../store/messages'
import useFetch from '../../hooks/useFetch'
import useUser from '../../hooks/useUser'
import { useCallback } from 'react'
import useFriends from '../Friends/useFriends'

export default function useMessage() {
  const { request } = useFetch()
  const { user } = useUser()
  const [messagesStore, setMessagesStore] = useRecoilState(messagesState)
  const { increaseUnseenMessages } = useFriends()

  const addMessage = (message: Message) => {
    if (message.senderId !== user.id) {
      increaseUnseenMessages(message.senderId)
    }
    setMessagesStore((prev) => ({ ...prev, messages: [...prev.messages, message] }))
  }

  const getUnseenMessagesRequest = async () => {
    const res = await request<Message[]>('/Message/Unseen')

    setMessagesStore((prev) => ({ ...prev, unseenMessages: res.data }))
  }

  const setMessages = (messages: Message[]) => {
    setMessagesStore((prev) => ({ ...prev, messages }))
  }

  const getMessageById = (id: number) => {
    return messagesStore.messages.find((message) => message.id === id)
  }

  const seenMessageRequest = async (message: Message) => {
    if (message?.senderId !== user.id && !message?.seen) {
      await request('/Messages/Seen/' + message.id, 'PUT')
    }
  }

  const loadMessages = async (userId: number, receiverId: number) => {
    const response = await request<Message[]>('/Messages?userId=' + userId + '&receiverId=' + receiverId)
    return response
  }

  const setSeenMessage = useCallback((id: number) => {
    setMessagesStore((prev) => ({
      ...prev,
      messages: prev.messages.map((message) => (message.id === id ? { ...message, seen: true } : message)),
    }))
  }, [])

  return {
    addMessage,
    setMessages,
    loadMessages,
    messagesStore,
    getMessageById,
    seenMessageRequest,
    getUnseenMessagesRequest,
    setSeenMessage,
  }
}
