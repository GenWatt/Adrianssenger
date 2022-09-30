import { Grid, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { Friend } from '../../global'
import { getFriendById } from '../../store/friends'
import Messages from '../Messages/Messages'
import SendMessage from '../Messages/SendMessage'
import UserInfo from './UserInfo'

export default function RightPanel() {
  const getFriend = useRecoilValue(getFriendById)
  const { id } = useParams<{ id: string }>()
  const [currentFriend, setCurrentFriend] = useState<Friend | undefined>()
  const theme = useTheme()

  useEffect(() => {
    id && setCurrentFriend(getFriend(+id))
  }, [id])

  return (
    <Grid
      bgcolor={theme.palette.primary.light}
      item
      xs={12}
      md={8}
      container
      display="flex"
      direction="column"
      justifyContent="space-between"
      borderRadius={theme.spacing(0.5)}
      minHeight={window.innerHeight - 40}
      height={window.innerHeight - 16}
    >
      {currentFriend && <UserInfo user={currentFriend} />}

      <Messages />
      <SendMessage />
    </Grid>
  )
}
