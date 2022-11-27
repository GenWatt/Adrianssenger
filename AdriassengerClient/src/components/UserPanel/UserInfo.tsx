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
  Theme,
} from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'
import { useState } from 'react'
import { UserHeaderData } from '../../global'
import useUser from '../../hooks/useUser'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'

interface Props {
  user: UserHeaderData
  type?: UserInfoTypes
}

export enum UserInfoTypes {
  CURRENT_USER,
  FRIEND,
}

const useStyles = makeStyles()((theme: Theme) => {
  return {
    root: {
      position: 'absolute',
      top: theme.spacing(0.5),
      right: theme.spacing(0.5),
      cursor: 'pointer',
    },
  }
})

export default function UserInfo({ user, type = UserInfoTypes.CURRENT_USER }: Props) {
  const { logout } = useUser()
  const [isShow, setIsShow] = useState(false)
  const theme = useTheme()
  const { classes } = useStyles()
  const navigate = useNavigate()

  const showMenu = () => setIsShow(true)
  const closeMenu = () => setIsShow(false)

  return (
    <Grid borderRadius={theme.spacing(0.5)} bgcolor={theme.palette.primary.main} container position="relative" p={1}>
      {type === UserInfoTypes.CURRENT_USER && (
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
      <Grid container>
        <Grid container>
          <Avatar className="cursor-pointer" onClick={showMenu}></Avatar>
          <Typography ml={2} variant="body1">
            {user.userName}
          </Typography>
        </Grid>
        {type === UserInfoTypes.FRIEND && <CloseOutlined onClick={() => navigate('/')} className={classes.root} />}
      </Grid>
    </Grid>
  )
}
