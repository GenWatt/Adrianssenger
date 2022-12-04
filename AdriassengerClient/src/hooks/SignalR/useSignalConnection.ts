import useSignalR from './useSignalR'
import useFriends from '../../components/Friends/useFriends'
import useNotifications from '../../components/Notifications/useNotifications'
import useMessage from '../../components/Messages/useMessage'
import { Message } from '../../global'

export default function useSignalConnection() {
  const { connection } = useSignalR()
  const { removeFriend, acceptFriendRequest, rejectFriendRequest, setLastMessage } = useFriends()
  const { removeNotification } = useNotifications()
  const { addMessage } = useMessage()

  const lastMessage = (message: Message) => {
    addMessage(message)
    setLastMessage(message)
  }

  const makeConnections = () => {
    connection?.on('SendFriendRequestAccept', acceptFriendRequest)
    connection?.on('SendFriendRequestReject', rejectFriendRequest)
    connection?.on('RemoveNotification', removeNotification)
    connection?.on('RemoveFriend', removeFriend)
    connection?.on('SendMessage', lastMessage)
  }

  const disconnect = () => {
    connection?.off('SendFriendRequestAccept', acceptFriendRequest)
    connection?.off('SendFriendRequestReject', rejectFriendRequest)
    connection?.off('RemoveNotification', removeNotification)
    connection?.off('RemoveFriend', removeFriend)
    connection?.off('SendMessage', lastMessage)
  }

  return { disconnect, makeConnections, connection }
}
