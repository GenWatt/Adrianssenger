import useSignalR from './useSignalR'
import useFriends from '../../components/Friends/useFriends'
import useNotifications from '../../components/Notifications/useNotifications'
import useMessage from '../../components/Messages/useMessage'
import { Message } from '../../global'

export default function useSignalConnection() {
  const { connection } = useSignalR()
  const { removeFriend, acceptFriendRequest, rejectFriendRequest, setLastMessage, decreaseUnseenMessages } =
    useFriends()
  const { removeNotification } = useNotifications()
  const { addMessage, setSeenMessage } = useMessage()

  const lastMessage = (message: Message) => {
    addMessage(message)
    setLastMessage(message)
  }

  const seenMessage = (senderId: number, messageId: number) => {
    decreaseUnseenMessages(senderId)
    setSeenMessage(messageId)
  }

  const makeConnections = () => {
    connection?.on('SendFriendRequestAccept', acceptFriendRequest)
    connection?.on('SendFriendRequestReject', rejectFriendRequest)
    connection?.on('RemoveNotification', removeNotification)
    connection?.on('RemoveFriend', removeFriend)
    connection?.on('SendMessage', lastMessage)
    connection?.on('SeenMessage', seenMessage)
    connection?.on('ReciverSeenMessage', setSeenMessage)
  }

  const disconnect = () => {
    connection?.off('SendFriendRequestAccept', acceptFriendRequest)
    connection?.off('SendFriendRequestReject', rejectFriendRequest)
    connection?.off('RemoveNotification', removeNotification)
    connection?.off('RemoveFriend', removeFriend)
    connection?.off('SendMessage', lastMessage)
    connection?.off('SeenMessage', seenMessage)
    connection?.off('ReciverSeenMessage', setSeenMessage)
  }

  return { disconnect, makeConnections, connection }
}
