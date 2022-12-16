import { Grid, List } from '@mui/material'
import { NotificationState } from '../../global'
import NotificationItem from './NotificationItem'
import NotFound from '../UI/NotFound/NotFound'

type Props = {
  notifications: NotificationState[]
}

export default function NotificationList({ notifications }: Props) {
  return (
    <Grid p={1} container>
      {notifications.length ? (
        <List>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </List>
      ) : (
        <NotFound>You don't have notifications!</NotFound>
      )}
    </Grid>
  )
}
