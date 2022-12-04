import { Button, Grid, ListItem, Theme, Typography, useTheme } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { NotificationState } from '../../global'
import useFetch from '../../hooks/useFetch'
import useText from '../../hooks/useText'
import IconButton from '../UI/Buttons/IconButton'
import useNotifications from './useNotifications'

type NotificationItemProps = {
  notification: NotificationState
}

const useStyles = makeStyles()((theme: Theme) => {
  return {
    roots: {
      backgroundColor: theme.palette.primary.light,
      borderRadius: theme.spacing(0.5),
      marginTop: theme.spacing(0.5),
      transition: 'background-color .3s ease',
      ['&:hover']: {
        backgroundColor: theme.palette.primary.main,
      },
    },
    closeIcon: {
      alignSelf: 'flex-end',
      cursor: 'pointer',
    },
  }
})

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { classes } = useStyles()
  const theme = useTheme()
  const { request, isLoading } = useFetch()
  const { getDateString } = useText()
  const { deleteNotificationApi, removeNotification } = useNotifications()

  const acceptRequest = async (notification: NotificationState) => {
    try {
      await request(`${notification.acceptUrl}/${notification.actionId}`, 'PUT')
    } catch (error) {}
  }

  const rejectRequest = async (notification: NotificationState) => {
    try {
      await request(`${notification.rejectUrl}/${notification.actionId}`, 'DELETE')
    } catch (error) {}
  }

  const deleteNotification = (id: number) => {
    deleteNotificationApi(id)
    removeNotification(id)
  }

  return (
    <ListItem className={classes.roots}>
      <IconButton
        onClick={() => deleteNotification(notification.id)}
        style={{ position: 'absolute', right: theme.spacing(0.5), top: theme.spacing(0.5) }}
      >
        Close
      </IconButton>
      <Grid container direction="column">
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="body1">{notification.title}</Typography>
          <Typography p={1} variant="caption">
            {getDateString(notification.createdAt)}
          </Typography>
        </Grid>
        <Typography variant="body1">{notification.content}</Typography>
        <Grid pt={1} pb={0.5} container justifyContent="space-between">
          {notification.acceptUrl && (
            <Button
              disabled={isLoading}
              variant="contained"
              color="success"
              onClick={() => acceptRequest(notification)}
            >
              Accept
            </Button>
          )}
          {notification.rejectUrl && (
            <Button disabled={isLoading} variant="contained" color="error" onClick={() => rejectRequest(notification)}>
              Reject
            </Button>
          )}
        </Grid>
      </Grid>
    </ListItem>
  )
}
