import {
  Avatar,
  Dialog,
  Grid,
  MenuItem,
  MenuList,
  Typography,
  useTheme,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import { useState } from 'react'
import { UserHeaderData } from '../../global'
import useUser from '../../hooks/useUser'

interface Props {
  user: UserHeaderData
  isSettings?: boolean
}

export default function UserInfo({ user, isSettings }: Props) {
  const { logout } = useUser()
  const [isShow, setIsShow] = useState(false)
  const theme = useTheme()

  const showMenu = () => isSettings && setIsShow(true)
  const closeMenu = () => setIsShow(false)

  return (
    <Grid borderRadius={theme.spacing(0.5)} bgcolor={theme.palette.secondary.main} container position="relative" p={1}>
      <Avatar className="cursor-pointer" onClick={showMenu}></Avatar>

      {isSettings && (
        <Dialog open={isShow} onClose={closeMenu}>
          <DialogTitle color={theme.palette.text.secondary}>Quick Options</DialogTitle>
          <DialogContent>
            <MenuList>
              <MenuItem>Setting</MenuItem>
              <MenuItem onClick={logout}>Log out</MenuItem>
            </MenuList>
          </DialogContent>
        </Dialog>
      )}

      <Typography ml={2} variant="body1">
        {user.username}
      </Typography>
    </Grid>
  )
}
