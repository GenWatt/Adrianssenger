import { Grid, Theme } from '@mui/material'
import { useState } from 'react'
import useUser from '../../hooks/useUser'
import FriendList from '../Friends/FriendList'
import FrindOptions from '../UserPanel/FrindOptions'
import UserInfo from '../UserPanel/UserInfo'
import { makeStyles } from 'tss-react/mui'
import useFriends from '../Friends/useFriends'

const useStyles = makeStyles<{ isFriendToChat: boolean }>()((theme: Theme, props) => {
  return {
    root: {
      [theme.breakpoints.down('sm')]: {
        display: props.isFriendToChat ? 'none' : 'block',
      },
    },
  }
})

export default function LeftPanel() {
  const [searchText, setSearchText] = useState('')
  const { user } = useUser()
  const { friendStore } = useFriends()
  const { classes } = useStyles({ isFriendToChat: Boolean(friendStore.currentTextingFriend) })

  const handleSearchFriend = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)

  return (
    <Grid item className={classes.root} xs={12} md={4}>
      <UserInfo user={user} />
      <FrindOptions handleSearch={handleSearchFriend} searchText={searchText} />
      <FriendList searchText={searchText} />
    </Grid>
  )
}
