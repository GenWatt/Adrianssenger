import { Grid, List } from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useMesure from '../../hooks/useMesure'
import { useNavigate, useParams } from 'react-router-dom'
import FriendListItem from './FriendListItem'
import useUser from '../../hooks/useUser'
import useSignalR from '../../hooks/useSignalR'
import useNotifications from '../../hooks/useNotifications'
import NotFound from '../UI/NotFound/NotFound'
import useFriends from '../../hooks/useFriends'
import Loader from '../UI/Loaders/Loader'

interface FrindListProps {
  searchText: string
}

export default function FrindList({ searchText }: FrindListProps) {
  const [listHeight, setListHeight] = useState<string | number>('60vh')
  const [message, setMessage] = useState<string>('You have no friends :-(')
  const { addNotification } = useNotifications()
  const { loadFriends, setCurrentTextingFriend, isLoading, friendStore } = useFriends()
  const { user } = useUser()
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
      await loadFriends(user.id)
    } catch (error) {
      setMessage('Something goes wrong with fetching friends')
    }
  }

  useLayoutEffect(() => {
    calculateHeight()
  }, [])

  useEffect(() => {
    id && messageFriend(+id)
    getFriends()
  }, [id])

  useEffect(() => {
    signalR.connection?.on('SendFriendRequest', addNotification)

    return () => {
      signalR.connection?.off('SendFriendRequest', addNotification)
    }
  }, [signalR.connection])

  return (
    <>
      {isLoading && <Loader />}
      {friendStore.friends.length && !isLoading ? (
        <List ref={list} style={{ overflow: 'hidden auto', height: listHeight }}>
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