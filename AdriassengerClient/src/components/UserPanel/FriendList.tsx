import { CircularProgress, Grid, List, Typography } from '@mui/material'
import { useRecoilState } from 'recoil'
import { friendsState } from '../../store/friends'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useMesure from '../../hooks/useMesure'
import { useNavigate, useParams } from 'react-router-dom'
import FriendListItem from '../UI/FriendListItem'
import useFetch from '../../hooks/useFetch'
import useUser from '../../hooks/useUser'
import { ApiResponse, Friend } from '../../global'

interface Props {
  searchText: string
}

export default function FrindList({ searchText }: Props) {
  const [listHeight, setListHeight] = useState<string | number>('60vh')
  const [message, setMessage] = useState<string>('You have no friends :-(')
  const [friendValues, setFriendValues] = useRecoilState(friendsState)
  const { user } = useUser()
  const { pixelsFromTopToElement } = useMesure()
  const { callApi, isLoading, isError } = useFetch()
  const navigate = useNavigate()
  const list = useRef<HTMLUListElement | null>(null)
  const { id } = useParams<{ id: string }>()

  const calculateHeight = () => {
    if (list.current) {
      setListHeight(pixelsFromTopToElement(list.current))
    }
  }

  const messageFriend = (id: number) => {
    setFriendValues({ ...friendValues, currentTextingFriend: id })
    navigate('/messages/' + id)
  }

  const isSelected = (uid: number) => {
    return id && +id === uid ? true : false
  }

  const loadFriends = async () => {
    const res = await callApi<ApiResponse<Friend[]>>('/Friends/' + user.id)

    if (!res) return

    if (!isError(res)) {
      setMessage('Something goes wrong with fetching friends')
    } else {
      setFriendValues((curr) => ({ ...curr, friends: res.data }))
    }
  }

  useLayoutEffect(() => {
    calculateHeight()
  }, [])

  useEffect(() => {
    id && messageFriend(+id)
    loadFriends()
  }, [id])

  return (
    <>
      {isLoading && (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      )}
      {friendValues.friends.length && !isLoading ? (
        <List ref={list} style={{ overflow: 'hidden auto', height: listHeight }}>
          {friendValues.friends
            .filter((friend) => friend.username.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
            .map((friend) => (
              <FriendListItem
                isSelect={isSelected(friend.id)}
                onClick={() => messageFriend(friend.id)}
                className="cursor-pointer"
                divider
                friend={friend}
                key={friend.id}
              />
            ))}
        </List>
      ) : null}
      {!isLoading && !friendValues.friends.length ? (
        <Typography textAlign="center" variant="body1">
          {message}
        </Typography>
      ) : null}
    </>
  )
}
