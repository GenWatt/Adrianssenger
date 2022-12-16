import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { friendsState, initialFriendsValue } from '../store/friends'
import { initialMessagesValue, messagesState } from '../store/messages'
import { initialNotificationState, notificationState } from '../store/notification'
import { initialUserValue, userState } from '../store/user'
import useLocalStorage from './useLocalStorage'

export default function useReset() {
  const [messages, setMessages] = useRecoilState(messagesState)
  const [notifications, setNotifications] = useRecoilState(notificationState)
  const [user, setUser] = useRecoilState(userState)
  const [friends, setFriends] = useRecoilState(friendsState)
  const { setObj } = useLocalStorage()

  const navigate = useNavigate()

  const reset = () => {
    setUser(initialUserValue)
    setObj<string>('user', '')
    setNotifications(initialNotificationState)
    setMessages(initialMessagesValue)
    setFriends(initialFriendsValue)
  }

  const resetAndNavigateToLoginPage = () => {
    reset()
    navigate('/login', { replace: true })
  }

  return { reset, resetAndNavigateToLoginPage }
}
