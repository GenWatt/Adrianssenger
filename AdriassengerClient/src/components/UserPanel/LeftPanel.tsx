import { Grid } from '@mui/material'
import { useState } from 'react'
import useUser from '../../hooks/useUser'
import FriendList from './FriendList'
import FrindOptions from './FrindOptions'
import UserInfo from './UserInfo'

export default function LeftPanel() {
  const [searchText, setSearchText] = useState('')
  const { user } = useUser()

  const handleSearchFriend = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)

  return (
    <Grid item xs={12} md={4}>
      <UserInfo user={user} isSettings />
      <FrindOptions handleSearch={handleSearchFriend} searchText={searchText} />
      <FriendList searchText={searchText} />
    </Grid>
  )
}
