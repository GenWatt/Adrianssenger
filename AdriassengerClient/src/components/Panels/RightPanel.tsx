import { Grid, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { Friend } from '../../global'
import useFriends from '../Friends/useFriends'
import useFromTheme from '../../hooks/useFromTheme'
import useMessage from '../Messages/useMessage'
import useUser from '../../hooks/useUser'
import { getFriendById } from '../../store/friends'
import Messages from '../Messages/Messages'
import SendMessage from '../Messages/SendMessage'
import UserInfo, { UserInfoTypes } from '../UserPanel/UserInfo'
import NotFound from '../UI/NotFound/NotFound'

export default function RightPanel() {
  const getFriend = useRecoilValue(getFriendById)
  const { user } = useUser()
  const { id } = useParams<{ id: string }>()
  const [currentFriend, setCurrentFriend] = useState<Friend | undefined>()
  const theme = useTheme()
  const { friendStore } = useFriends()
  const container = useRef<any>(null)
  const { getNumberFromSpacing } = useFromTheme()
  const { setMessages, loadMessages, messagesStore } = useMessage()
  const [errorMessage, setErrorMessage] = useState('')

  const fetchMessages = async (id: number) => {
    try {
      const response = await loadMessages(id, user.id)
      setMessages(response.data)
    } catch (err) {
      setErrorMessage('Can not fetch messages')
    }
  }

  const getMinHeight = () => {
    if (container.current) {
      return window.innerHeight - container.current.offsetTop - getNumberFromSpacing(1)
    }

    return '70vh'
  }

  useEffect(() => {
    if (id) {
      const idNum = +id

      setErrorMessage('')
      setCurrentFriend(getFriend(idNum))
      fetchMessages(idNum)
    }
  }, [id, friendStore])

  return (
    <Grid
      border={`${theme.spacing(0.1)} solid ${theme.palette.primary.light}`}
      item
      xs={12}
      md={8}
      container
      ref={container}
      display="flex"
      direction="column"
      justifyContent="space-between"
      borderRadius={theme.spacing(0.5)}
      height={getMinHeight()}
    >
      {currentFriend && <UserInfo user={currentFriend} type={UserInfoTypes.FRIEND} />}
      {errorMessage ? <NotFound>{errorMessage}</NotFound> : <Messages messages={messagesStore.messages} />}
      <SendMessage />
    </Grid>
  )
}
