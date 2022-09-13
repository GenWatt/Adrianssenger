import { Avatar, Grid, Typography } from '@mui/material'
import { useRecoilState } from 'recoil'
import { userState } from '../../store/user'

export default function UserInfo() {
  const [user, setUser] = useRecoilState(userState)

  return (
    <Grid container>
      <Avatar></Avatar>
      <Typography variant="body1">{user.username}</Typography>
    </Grid>
  )
}
