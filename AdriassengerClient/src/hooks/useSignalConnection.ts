import useSignalR from './useSignalR'
import useFriends from './useFriends'
import useNotifications from './useNotifications'
import useMessage from './useMessage'

export default function useSignalConnection() {
  const { connection } = useSignalR()
  const { removeFriend, acceptFriendRequest, rejectFriendRequest } = useFriends()
  const { removeNotification } = useNotifications()
  const { addMessage } = useMessage()

  const makeConnections = () => {
    connection?.on('SendFriendRequestAccept', acceptFriendRequest)
    connection?.on('SendFriendRequestReject', rejectFriendRequest)
    connection?.on('RemoveNotification', removeNotification)
    connection?.on('RemoveFriend', removeFriend)
    connection?.on('SendMessage', addMessage)
  }

  const disconnect = () => {
    connection?.off('SendFriendRequestAccept', acceptFriendRequest)
    connection?.off('SendFriendRequestReject', rejectFriendRequest)
    connection?.off('RemoveNotification', removeNotification)
    connection?.off('RemoveFriend', removeFriend)
    connection?.off('SendMessage', addMessage)
  }

  return { disconnect, makeConnections, connection }
}
