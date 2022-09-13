import { Grid } from '@mui/material'
import FriendList from './FriendList'
import UserInfo from './UserInfo'

export default function LeftPanel() {
  return (
    <Grid container>
      <UserInfo />
      <FriendList />
    </Grid>
  )
}
