import { Grid, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { Friend } from '../../global'
import useFriends from '../../components/Friends/useFriends'
import useFromTheme from '../../hooks/useFromTheme'
import useMessage from '../../components/Messages/useMessage'
import useUser from '../../hooks/useUser'
import { getFriendById } from '../../store/friends'
import Messages from '../../components/Messages/Messages'
import SendMessage from '../../components/Messages/SendMessage'
import UserInfo, { UserInfoTypes } from '../../components/UserPanel/UserInfo'
import NotFound from '../../components/UI/NotFound/NotFound'

export default function RightPanel() {
  const getFriend = useRecoilValue(getFriendById)
  const { user } = useUser()
  const { id } = useParams<{ id: string }>()
  const [currentFriend, setCurrentFriend] = useState<Friend | undefined>()
  const theme = useTheme()
  const { friendStore, friendExists, setCurrentTextingFriend } = useFriends()
  const container = useRef<any>(null)
  const { getNumberFromSpacing } = useFromTheme()
  const { setMessages, loadMessages, messagesStore } = useMessage()
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const fetchMessages = async (id: number) => {
    try {
      const response = await loadMessages(user.id, id)
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

  const onCloseMessageWindow = () => {
    setCurrentTextingFriend(null)
  }

  useEffect(() => {
    if (id) {
      const idNum = +id

      if (!friendExists(idNum)) {
        setCurrentTextingFriend(null)
        return navigate(-1)
      }

      setCurrentTextingFriend(idNum)
      setErrorMessage('')
      setCurrentFriend(getFriend(idNum))
      fetchMessages(idNum)
    }
  }, [id, friendStore.friends])

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
      {currentFriend && <UserInfo user={currentFriend} type={UserInfoTypes.FRIEND} onClose={onCloseMessageWindow} />}
      {errorMessage ? <NotFound>{errorMessage}</NotFound> : <Messages messages={messagesStore.messages} />}
      <SendMessage />
    </Grid>
  )
}
