import { List } from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useMesure from '../../hooks/useMesure'
import { useNavigate, useParams } from 'react-router-dom'
import FriendListItem from './FriendListItem'
import useSignalR from '../../hooks/SignalR/useSignalR'
import useNotifications from '../Notifications/useNotifications'
import NotFound from '../UI/NotFound/NotFound'
import useFriends from './useFriends'
import Loader from '../UI/Loaders/Loader'

interface FrindListProps {
  searchText: string
}

export default function FrindList({ searchText }: FrindListProps) {
  const [listHeight, setListHeight] = useState<string | number>('60vh')
  const [message, setMessage] = useState<string>('You have no friends :-(')
  const { addNotification } = useNotifications()
  const { loadFriends, setCurrentTextingFriend, isLoading, friendStore } = useFriends()
  const { pixelsFromTopToElement } = useMesure()
  const signalR = useSignalR()
  const navigate = useNavigate()
  const list = useRef<HTMLUListElement | null>(null)
  const { id } = useParams<{ id: string }>()

  const calculateHeight = () => {
    if (list.current) {
      setListHeight(pixelsFromTopToElement(list.current))
    }
  }

  const messageFriend = (id: number) => {
    setCurrentTextingFriend(id)
    navigate('/messages/' + id)
  }

  const isSelected = (uid: string) => {
    return id && id === uid ? true : false
  }

  const getFriends = async () => {
    try {
      await loadFriends()
    } catch (error) {
      setMessage('Something goes wrong with fetching friends')
    }
  }

  useLayoutEffect(() => {
    calculateHeight()
  }, [])

  useEffect(() => {
    id && messageFriend(+id)
  }, [id])

  useEffect(() => {
    signalR.connection?.on('SendFriendRequest', addNotification)
    getFriends()

    return () => {
      signalR.connection?.off('SendFriendRequest', addNotification)
    }
  }, [signalR.connection])

  return (
    <>
      {isLoading && <Loader />}
      {friendStore.friends.length && !isLoading ? (
        <List ref={list} style={{ overflow: 'hidden auto', height: listHeight, width: '100%' }}>
          {friendStore.friends
            .filter((friend) => friend.userName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
            .map((friend) => (
              <FriendListItem
                isSelect={isSelected(friend.id.toString())}
                className="cursor-pointer"
                divider
                friend={friend}
                key={friend.id}
              />
            ))}
        </List>
      ) : null}
      {!isLoading && !friendStore.friends.length ? <NotFound>{message}</NotFound> : null}
    </>
  )
}
