import { Badge, Grid, Popover } from '@mui/material'
import Notifications from '@mui/icons-material/Notifications'
import { useEffect, useState } from 'react'
import NotificationList from '../Notifications/NotificationList'
import { useRecoilState } from 'recoil'
import { notificationState } from '../../store/notification'
import useFetch from '../../hooks/useFetch'
import { NotificationState } from '../../global'
import IconButton from './Buttons/IconButton'
import { useSnackbar } from 'notistack'

export default function AppBar() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [notificationStore, setNotificationStore] = useRecoilState(notificationState)
  const { request } = useFetch()
  const { enqueueSnackbar } = useSnackbar()

  const openNotificationList = (e: any) => {
    setAnchorEl(e.target)
  }

  const handleClose = () => setAnchorEl(null)

  const id = anchorEl ? 'Notifications popover' : undefined

  const getUserNotifications = async () => {
    try {
      const response = await request<NotificationState[]>('/Notification')

      setNotificationStore(() => ({ notifications: response.data }))
    } catch (error) {
      enqueueSnackbar('Unable to fetch notifications', { variant: 'error' })
    }
  }

  useEffect(() => {
    getUserNotifications()
  }, [])

  return (
    <Grid p={2} container justifyContent="space-between">
      <Grid item>Logo</Grid>
      <Grid item>
        <IconButton>
          <Badge onClick={openNotificationList} badgeContent={notificationStore.notifications.length} color="secondary">
            <Notifications aria-describedby={id} />
          </Badge>
        </IconButton>
        <Popover
          id={id}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <NotificationList notifications={notificationStore.notifications} />
        </Popover>
      </Grid>
    </Grid>
  )
}
