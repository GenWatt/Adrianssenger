import { Avatar, Grid, MenuItem, MenuList, Typography, useTheme } from '@mui/material'
import { CSSProperties, useState } from 'react'
import useUser from '../../hooks/useUser'

const listStyles: CSSProperties = {
  position: 'absolute',
  left: 60,
}

export default function UserInfo() {
  const { logout, user } = useUser()
  const [isShow, setIsShow] = useState(false)
  const theme = useTheme()

  const showMenu = () => setIsShow((prev) => !prev)

  return (
    <Grid bgcolor={theme.palette.secondary.main} container position="relative" p={1}>
      <Avatar className="cursor-pointer" onClick={showMenu}></Avatar>
      {isShow && (
        <MenuList style={listStyles}>
          <MenuItem>Setting</MenuItem>
          <MenuItem onClick={logout}>Log out</MenuItem>
        </MenuList>
      )}
      <Typography ml={2} variant="body1">
        {user.username}
      </Typography>
    </Grid>
  )
}
