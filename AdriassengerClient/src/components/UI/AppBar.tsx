import { Badge, Grid, Popover, Tooltip, Typography, useTheme } from '@mui/material'
import NotificationIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import { useEffect, useState } from 'react'
import NotificationList from '../Notifications/NotificationList'
import IconButton from './Buttons/IconButton'
import useNotifications from '../Notifications/useNotifications'
import Loader from './Loaders/Loader'
import UserMenu from './Dialogs/UserMenu'

export default function AppBar() {
  const [isOpen, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { loadNotifications, notificationStore, isLoading, notificationLength } = useNotifications()
  const theme = useTheme()

  const openNotificationList = (e: any) => {
    setAnchorEl(e.target)
  }

  const handleClose = () => setAnchorEl(null)

  const openUserMenu = () => setOpen(true)
  const closeUserMenu = () => setOpen(false)

  const id = anchorEl ? 'Notifications popover' : undefined

  const getNotificationsTooltipTitle = () =>
    notificationLength() ? `You have ${notificationLength()} notifications` : "You don't have notifications"

  useEffect(() => {
    loadNotifications()
  }, [])

  return (
    <Grid mb={1} borderRadius={theme.spacing(0.4)} container justifyContent="space-between" alignItems="center">
      <UserMenu isShow={isOpen} closeMenu={closeUserMenu} />
      <Grid item>
        <Typography variant="h5" textTransform="uppercase" fontWeight="bold">
          Chat App
        </Typography>
      </Grid>
      <Grid item display="flex" style={{ paddingRight: theme.spacing(1), gap: theme.spacing(0.5) }}>
        <Tooltip title={getNotificationsTooltipTitle()}>
          <div>
            <IconButton>
              <Badge
                onClick={openNotificationList}
                badgeContent={notificationStore.notifications.length}
                color="secondary"
              >
                <NotificationIcon aria-describedby={id} />
              </Badge>
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip title="Options">
          <div>
            <IconButton onClick={openUserMenu} style={{ height: 24 }}>
              <SettingsIcon />
            </IconButton>
          </div>
        </Tooltip>
      </Grid>
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
        {isLoading && <Loader />}
        <NotificationList notifications={notificationStore.notifications} />
      </Popover>
    </Grid>
  )
}
