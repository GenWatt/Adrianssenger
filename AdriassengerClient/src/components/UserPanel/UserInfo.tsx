import { Avatar, Grid, Typography, useTheme, Theme } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'
import { UserHeaderData } from '../../global'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'

interface UserInfoProps {
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

export default function UserInfo({ user, type = UserInfoTypes.CURRENT_USER }: UserInfoProps) {
  const theme = useTheme()
  const { classes } = useStyles()
  const navigate = useNavigate()

  return (
    <Grid borderRadius={theme.spacing(0.5)} bgcolor={theme.palette.primary.main} container position="relative" p={1}>
      <Grid container>
        <Grid container>
          <Avatar className="cursor-pointer"></Avatar>
          <Typography ml={2} variant="body1">
            {user.userName}
          </Typography>
        </Grid>
        {type === UserInfoTypes.FRIEND && <CloseOutlined onClick={() => navigate('/')} className={classes.root} />}
      </Grid>
    </Grid>
  )
}
