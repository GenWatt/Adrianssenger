import { Badge, Grid, Popover, useTheme } from '@mui/material'
import NotificationIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import { useEffect, useState } from 'react'
import NotificationList from '../Notifications/NotificationList'
import IconButton from './Buttons/IconButton'
import Logo from '../../assets/adrianssenger.png'
import useNotifications from '../Notifications/useNotifications'
import Loader from './Loaders/Loader'
import UserMenu from './Dialogs/UserMenu'

export default function AppBar() {
  const [isOpen, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { loadNotifications, notificationStore, isLoading } = useNotifications()
  const theme = useTheme()

  const openNotificationList = (e: any) => {
    setAnchorEl(e.target)
  }

  const handleClose = () => setAnchorEl(null)

  const openUserMenu = () => setOpen(true)
  const closeUserMenu = () => setOpen(false)

  const id = anchorEl ? 'Notifications popover' : undefined

  useEffect(() => {
    loadNotifications()
  }, [])

  return (
    <Grid
      mb={1}
      borderRadius={theme.spacing(0.4)}
      bgcolor={theme.palette.primary.main}
      container
      justifyContent="space-between"
      alignItems="center"
    >
      <UserMenu isShow={isOpen} closeMenu={closeUserMenu} />
      <Grid item>
        <img
          style={{ width: theme.spacing(8), height: theme.spacing(8), borderRadius: theme.spacing(0.4) }}
          src={Logo}
          alt="logo"
        />
      </Grid>
      <Grid item display="flex" style={{ paddingRight: theme.spacing(1), gap: theme.spacing(0.5) }}>
        <IconButton>
          <Badge onClick={openNotificationList} badgeContent={notificationStore.notifications.length} color="secondary">
            <NotificationIcon aria-describedby={id} />
          </Badge>
        </IconButton>
        <IconButton onClick={openUserMenu} style={{ height: 24 }}>
          <SettingsIcon />
        </IconButton>
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
