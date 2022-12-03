import { Avatar, Grid, Typography, useTheme, Theme } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'
import { UserHeaderData } from '../../global'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'
import useFile from '../../hooks/useFile'

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
  const { getStaticFile } = useFile()

  return (
    <Grid
      borderBottom={`${theme.spacing(0.1)} solid ${theme.palette.primary.main}`}
      container
      position="relative"
      p={1}
    >
      <Grid container>
        <Grid container>
          <Avatar src={getStaticFile(user.avatarUrl)} className="cursor-pointer"></Avatar>
          <Typography ml={2} variant="body1">
            {user.userName}
          </Typography>
        </Grid>
        {type === UserInfoTypes.FRIEND && <CloseOutlined onClick={() => navigate('/')} className={classes.root} />}
      </Grid>
    </Grid>
  )
}
