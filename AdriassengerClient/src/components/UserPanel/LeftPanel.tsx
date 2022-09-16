import { Grid } from '@mui/material'
import FriendList from './FriendList'
import FrindOptions from './FrindOptions'
import UserInfo from './UserInfo'

export default function LeftPanel() {
  return (
    <Grid item xs={12} md={4}>
      <UserInfo />
      <FrindOptions />
      <FriendList />
    </Grid>
  )
}
