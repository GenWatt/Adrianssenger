import { friendsState } from '../../store/friends'
import { Friend, NotificationState } from '../../global'
import { useRecoilState } from 'recoil'
import useFetch from '../../hooks/useFetch'
import { SearchUser } from '../../global'
import useNotifications from '../Notifications/useNotifications'
import { useSnackbar } from 'notistack'

export default function useFriends() {
  const [friendStore, setFriendStore] = useRecoilState(friendsState)
  const { removeNotificationByActionId, addNotification } = useNotifications()
  const { enqueueSnackbar } = useSnackbar()
  const { request, isLoading } = useFetch()

  const loadFriends = async (userId: number) => {
    const res = await request<Friend[]>('/Friends/' + userId)

    setFriendStore((curr) => ({ ...curr, friends: res.data }))
  }

  const acceptFriendRequest = (friend: Friend) => {
    setFriendStore((prev) => ({ ...prev, friends: [...prev.friends, friend] }))
    removeNotificationByActionId(friend.friendId)
  }

  const rejectFriendRequest = (data: NotificationState) => addNotification(data)

  const removeFriend = (id: number) => {
    setFriendStore((prev) => ({ ...prev, friends: prev.friends.filter((friend) => friend.friendId !== id) }))
  }

  const addFriendToList = async (userId: number) => {
    await request<SearchUser>('/Friends', 'POST', {
      secondUserId: userId,
    })
    enqueueSnackbar('Request has sent!', { variant: 'success' })
  }

  const setCurrentTextingFriend = (id: number) => {
    setFriendStore({ ...friendStore, currentTextingFriend: id })
  }

  const deleteFriend = async (id: number) => {
    try {
      await request('/Friends/' + id, 'DELETE')
    } catch (error) {
      enqueueSnackbar('Unable to delete friend', { variant: 'error' })
    }
  }

  return {
    removeFriend,
    rejectFriendRequest,
    acceptFriendRequest,
    addFriendToList,
    friendStore,
    loadFriends,
    setCurrentTextingFriend,
    isLoading,
    deleteFriend,
    setFriendStore,
  }
}
